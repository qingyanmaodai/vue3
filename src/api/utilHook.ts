import { isFunction } from '/@/utils/is';
import { useMessage } from '/@/hooks/web/useMessage';
const { createMessage } = useMessage();

export const OptGroupHook = {
  submitGroup: async () => {},
  afterSubmit: (res: boolean, message: string, callback?: Function) => {
    try {
      if (res) {
        if (callback && isFunction(callback)) {
          callback();
        }
      } else {
        createMessage.error(message);
      }
    } catch (e: any) {
      console.log(e.message);
    }
  },
};
