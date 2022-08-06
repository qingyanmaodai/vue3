import type { AppRouteRecordRaw, Menu } from '/@/router/types';

import { defineStore } from 'pinia';
import { store } from '/@/store';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from './user';
import { useAppStoreWithOut } from './app';
import { toRaw } from 'vue';
import { transformObjToRoute, flatMultiLevelRoutes } from '/@/router/helper/routeHelper';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';

import projectSetting from '/@/settings/projectSetting';

import { PermissionModeEnum } from '/@/enums/appEnum';

import { asyncRoutes } from '/@/router/routes';
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';

import { filter } from '/@/utils/helper/treeHelper';

import { getMenuList } from '/@/api/sys/menu';
import { getPermCode } from '/@/api/sys/user';

import { useMessage } from '/@/hooks/web/useMessage';
import { PageEnum } from '/@/enums/pageEnum';
import { remove } from 'lodash-es';
// import { cloneDeep, forEach, remove } from 'lodash-es';
// import { list } from 'postcss';
// import { RouteMeta } from 'vue-router';
// import { REDIRECT_NAME } from '/@/router/constant';

interface PermissionState {
  // Permission code list
  permCodeList: string[] | number[];
  // Whether the route has been dynamically added
  isDynamicAddedRoute: boolean;
  // To trigger a menu update
  lastBuildMenuTime: number;
  // Backstage menu list
  backMenuList: Menu[];
  frontMenuList: Menu[];
}
export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    permCodeList: [],
    // Whether the route has been dynamically added
    isDynamicAddedRoute: false,
    // To trigger a menu update
    lastBuildMenuTime: 0,
    // Backstage menu list
    backMenuList: [],
    // menu List
    frontMenuList: [],
  }),
  getters: {
    getPermCodeList(): string[] | number[] {
      return this.permCodeList;
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList;
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList;
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },

    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list;
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    resetState(): void {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.backMenuList = [];
      this.lastBuildMenuTime = 0;
    },
    async changePermissionCode() {
      const codeList = await getPermCode();
      this.setPermCodeList(codeList);
    },
    async buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
      const { t } = useI18n();
      const userStore = useUserStore();
      const appStore = useAppStoreWithOut();

      let routes: AppRouteRecordRaw[] = [];
      const roleList = toRaw(userStore.getRoleList) || [];
      const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig;

      const routeFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { roles } = meta || {};
        if (!roles) return true;
        return roleList.some((role) => roles.includes(role));
      };

      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { ignoreRoute } = meta || {};
        return !ignoreRoute;
      };

      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
      const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
        if (!routes || routes.length === 0) return;
        let homePath: string = userStore.getUserInfo.homePath || PageEnum.BASE_HOME;
        function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
          if (parentPath) parentPath = parentPath + '/';
          routes.forEach((route: AppRouteRecordRaw) => {
            const { path, children, redirect } = route;
            const currentPath = path.startsWith('/') ? path : parentPath + path;
            if (currentPath === homePath) {
              if (redirect) {
                homePath = route.redirect! as string;
              } else {
                route.meta = Object.assign({}, route.meta, { affix: true });
                throw new Error('end');
              }
            }
            children && children.length > 0 && patcher(children, currentPath);
          });
        }
        try {
          patcher(routes);
        } catch (e) {
          // 已处理完毕跳出循环
        }
        return;
      };

      switch (permissionMode) {
        case PermissionModeEnum.ROLE:
          routes = filter(asyncRoutes, routeFilter);
          routes = routes.filter(routeFilter);
          // Convert multi-level routing to level 2 routing
          routes = flatMultiLevelRoutes(routes);
          break;

        case PermissionModeEnum.ROUTE_MAPPING:
          routes = filter(asyncRoutes, routeFilter);
          routes = routes.filter(routeFilter);
          const menuList = transformRouteToMenu(routes, true);
          routes = filter(routes, routeRemoveIgnoreFilter);
          routes = routes.filter(routeRemoveIgnoreFilter);
          menuList.sort((a, b) => {
            return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
          });

          this.setFrontMenuList(menuList);
          // Convert multi-level routing to level 2 routing
          routes = flatMultiLevelRoutes(routes);
          break;

        //  If you are sure that you do not need to do background dynamic permissions, please comment the entire judgment below
        case PermissionModeEnum.BACK:
          const { createMessage } = useMessage();

          createMessage.loading({
            content: t('sys.app.menuLoading'),
            duration: 1,
          });

          // !Simulate to obtain permission codes from the background,
          // this function may only need to be executed once, and the actual project can be put at the right time by itself
          let routeList: AppRouteRecordRaw[] = [];
          try {
            // single
            const dashboardRoute = {
              path: '/dashboard',
              name: 'Dashboard',
              component: 'LAYOUT',
              redirect: '/dashboard/analysis',
              orderNo: 2,
              meta: {
                title: 'routes.dashboard.dashboard',
                icon: 'bx:bx-home',
                hideChildrenInMenu: true,
              },
              children: [
                {
                  path: 'analysis',
                  name: 'Analysis',
                  component: '/dashboard/analysis/index',
                  meta: {
                    ignoreKeepAlive: false,
                    title: 'routes.dashboard.analysis',
                    icon: 'bx:bx-home',
                    currentActiveMenu: '/dashboard',
                  },
                },
              ],
            };
            routeList.push(dashboardRoute);
            let routeList2: AppRouteRecordRaw[] = [];
            // this.changePermissionCode();
            routeList2 = (await getMenuList()).menu as AppRouteRecordRaw[];
            remove(routeList2, (menu) => {
              const meta = menu.meta;
              return meta.title === '首页';
            });
            routeList2.forEach((menu) => {
              menu.meta.orderNo = 3;
              routeList.push(menu);
            });
            // console.log('kkkk', routeList2);
            // dashboardRoute.redirect = dashboardRoute.path + '/' + dashboardRoute.children[0].path;
            // routeList = [dashboardRoute];
          } catch (error) {
            console.error(error);
          }
          // Dynamically introduce components
          routeList = transformObjToRoute(routeList);
          console.log('看看', routeList);
          //  Background routing to menu structure
          const backMenuList = transformRouteToMenu(routeList);
          this.setBackMenuList(backMenuList);
          // remove meta.ignoreRoute item
          routeList = filter(routeList, routeRemoveIgnoreFilter);
          routeList = routeList.filter(routeRemoveIgnoreFilter);

          routeList = flatMultiLevelRoutes(routeList);
          routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
          break;
      }

      routes.push(ERROR_LOG_ROUTE);
      patchHomeAffix(routes);
      return routes;
    },
  },
});

// Need to be used outside the setup
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
