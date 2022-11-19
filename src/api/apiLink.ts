export const testApi = 'http://192.168.200.114:6211';
export enum Url {
  //物料分组
  ADD_MATERIAL_GROUP = '/stock/bd-material-group/save', //添加
  EDIT_MATERIAL_GROUP = '/stock/bd-material-group/update', //编辑
  DELETE_MATERIAL_GROUP = '/stock/bd-material-group/delete',
  QUERY_ONE_MATERIAL_GROUP = '/stock/bd-material-group/query-one',
  TREE_MATERIAL_GROUP = '/stock/bd-material-group/tree',
  //物料信息
  GET_MATERIAL_LIST = '/stock/bd-material/list', //获取列表
  GET_MAT_DTO = '/stock/bd-material/query-dto', //获取物料信息实体信息
  ADD_MATERIAL = '/stock/bd-material/save',
  AUDIT_MATERIAL = '/stock/bd-material/audit',
  BATCH_AUDIT_MATERIAL = '/stock/bd-material/batch-audit',
  UN_AUDIT_MATERIAL = '/stock/bd-material/un-audit',
  BATCH_UN_AUDIT_MATERIAL = '/stock/bd-material/batch-un-audit',
  UPDATE_MATERIAL = '/stock/bd-material/update',
  GET_MATERIAL_BY_ID = '/stock/bd-material/getOneMaterial',
  DEL_MATERIAL = '/stock/bd-material/delete',
  BATCH_DEL_MATERIAL = '/stock/bd-material/batch-delete',
  EXPORT_MATERIAL_LIST = '/stock/bd-material/export-list',
  IMPORT_MATERIAL = 'http://192.168.200.136:9999/stock/bd-material/import-list',
  IMPORT_MODEL = '/stock/bd-material/import-model',

  //供应商
  SUPPLIER_GET_DATA = '/stock/bd-supplier/list', //获取供应商列表
  SUPPLIER_GET_ONE = '/stock/bd-supplier/query-one', //查询单个供应商
  GET_SUPPLIER_DTO = '/stock/bd-supplier/query-dto', //获取供应商实体信息
  SUPPLIER_SAVE = '/stock/bd-supplier/save', //保存单个供应商
  SUPPLIER_UPDATE = '/stock/bd-supplier/update', //修改单个供应商
  SUPPLIER_AUDIT = '/stock/bd-supplier/audit', //供应商审核
  SUPPLIER_BATCH_AUDIT = '/stock/bd-supplier/batch-audit', //供应商批量审核
  SUPPLIER_UN_AUDIT = '/stock/bd-supplier/un-audit', //供应反审核
  SUPPLIER_BATCH_UN_AUDIT = '/stock/bd-supplier/batch-un-audit', //供应商批量反审核
  SUPPLIER_DELETE = '/stock/bd-supplier/delete', //供应商删除
  SUPPLIER_BATCH_DELETE = '/stock/bd-supplier/batch-delete', //供应商批量删除
  SUPPLIER_EXPORT_DATA = '/stock/bd-supplier/export-list', //供应商导出
  SUPPLIER_IMPORT = 'http://192.168.200.136:9999/stock/bd-supplier/import-list', //供应商导入
  SUPPLIER_IMPORT_MODEL = '/stock/bd-supplier/import-model', //供应商导入模板下载
  SUPPLIER_GROUP_ADD = '/stock/bd-supplier-group/save', //新增供应商分组
  SUPPLIER_GROUP_UPDATE = '/stock/bd-supplier-group/update', //修改供应商分组
  SUPPLIER_GROUP_DELETE = '/stock/bd-supplier-group/delete', //删除供应商分组
  SUPPLIER_GROUP_GET_ONE = '/stock/bd-supplier-group/query-one', //查询单个供应商分组
  SUPPLIER_GROUP_GET_TREE = '/stock/bd-supplier-group/tree', //获取供应商分组

  //客户
  CUSTOMER_GET_DATA = '/stock/bd-customer/list', //获取客户列表
  CUSTOMER_GET_ONE = '/stock/bd-customer/query-one', //查询单个客户
  GET_CUSTOMER_DTO = '/stock/bd-customer/query-dto', //获取客户实体信息
  CUSTOMER_SAVE = '/stock/bd-customer/save', //保存单个客户
  CUSTOMER_UPDATE = '/stock/bd-customer/update', //修改单个客户
  CUSTOMER_AUDIT = '/stock/bd-customer/audit', //客户审核
  CUSTOMER_BATCH_AUDIT = '/stock/bd-customer/batch-audit', //客户批量审核
  CUSTOMER_UN_AUDIT = '/stock/bd-customer/un-audit', //客户反审核
  CUSTOMER_BATCH_UN_AUDIT = '/stock/bd-customer/batch-un-audit', //客户批量反审核
  CUSTOMER_DELETE = '/stock/bd-customer/delete', //客户删除
  CUSTOMER_BATCH_DELETE = '/stock/bd-customer/batch-delete', //客户批量删除
  CUSTOMER_EXPORT_DATA = '/stock/bd-customer/export-list', //客户导出
  CUSTOMER_IMPORT = 'http://192.168.200.136:9999/stock/bd-customer/import-list', //客户导入
  CUSTOMER_IMPORT_MODEL = '/stock/bd-customer/import-model', //客户导入模板下载
  CUSTOMER_GROUP_ADD = '/stock/bd-customer-group/save', //新增客户分组
  CUSTOMER_GROUP_UPDATE = '/stock/bd-customer-group/update', //修改客户分组
  CUSTOMER_GROUP_DELETE = '/stock/bd-customer-group/delete', //删除客户分组
  CUSTOMER_GROUP_GET_ONE = '/stock/bd-customer-group/query-one', //查询单个客户分组
  CUSTOMER_GROUP_GET_TREE = '/stock/bd-customer-group/tree', //获取客户分组

  //员工
  EMPLOYEE_GET_DATA = '/stock/bd-employee/list', //获取员工列表
  EMPLOYEE_GET_ONE = '/stock/bd-employee/query-one', //查询单个员工
  GET_EMPLOYEE_DTO = '/stock/bd-employee/query-dto', //获取员工实体信息
  EMPLOYEE_SAVE = '/stock/bd-employee/save', //保存单个员工
  EMPLOYEE_UPDATE = '/stock/bd-employee/update', //修改单个员工
  EMPLOYEE_AUDIT = '/stock/bd-employee/audit', //员工审核
  EMPLOYEE_BATCH_AUDIT = '/stock/bd-employee/batch-audit', //员工批量审核
  EMPLOYEE_UN_AUDIT = '/stock/bd-employee/un-audit', //员工反审核
  EMPLOYEE_BATCH_UN_AUDIT = '/stock/bd-employee/batch-un-audit', //员工批量反审核
  EMPLOYEE_DELETE = '/stock/bd-employee/delete', //员工删除
  EMPLOYEE_BATCH_DELETE = '/stock/bd-employee/batch-delete', //员工批量删除
  EMPLOYEE_EXPORT_DATA = '/stock/bd-employee/export-list', //员工导出
  EMPLOYEE_IMPORT = 'http://192.168.200.136:9999/stock/bd-employee/import-list', //员工导入
  EMPLOYEE_IMPORT_MODEL = '/stock/bd-employee/import-model', //员工导入模板下载

  //部门
  DEPT_ADD = '/stock/bd-department/save', //新增员工分组
  DEPT_UPDATE = '/stock/bd-department/update', //修改员工分组
  DEPT_DELETE = '/stock/bd-department/delete', //删除员工分组
  DEPT_GET_ONE = '/stock/bd-department/query-one', //查询单个员工分组
  DEPT_GET_TREE = '/stock/bd-department/tree', //获取员工分组

  //共用--实体信息--搜索的下拉框
  GET_UNIT_DTO = '/stock/bd-unit/query-dto', //计量（基本）单位查询字段
  GET_STOCK_DTO = '/stock/bd-stock/query-dto', //获取仓库实体信息--搜索的下拉框
  GET_SUB_STOCK_DTO = '/stock/bd-stock-compartment/query-dto', //获取分仓实体信息
  GET_LOCATION_DTO = '/stock/bd-stock-location/query-dto', //获取仓位实体信息

  //仓库管理
  AUDIT_STOCK_LIST = '/stock/bd-stock/audit', //审核
  BATCH_AUDIT_STOCK_LIST = '/stock/bd-stock/batch-audit', //批量审核
  UN_AUDIT_STOCK_LIST = '/stock/bd-stock/un-audit', //反审核
  UN_BATCH_AUDIT_STOCK_LIST = '/stock/bd-stock/batch-un-audit', //批量反审核
  DELETE_STOCK_LIST = '/stock/bd-stock/delete', //删除
  BATCH_DELETE_STOCK_LIST = '/stock/bd-stock/batch-delete', //批量删除
  GET_PAGE_STOCK_LIST = '/stock/bd-stock/list', //分页查询--获取仓库列表
  GET_ONE_STOCK_LIST = '/stock/bd-stock/query-one', //查询单条
  IMPORT_STOCK_LIST = 'http://192.168.200.136:9999/stock/bd-stock/import-list', //导入
  IMPORT_MODEL_STOCK_LIST = '/stock/bd-stock/import-model', //导入模板下载
  EXPORT_STOCK_LIST = '/stock/bd-stock/export-list', //导出
  ADD_STOCK_LIST = '/stock/bd-stock/save', //添加
  UPDATE_STOCK_LIST = '/stock/bd-stock/update', //编辑

  //质量检验
  ADD_EXA_GROUP = '/stock/bd-examine-group/save', //添加
  EDIT_EXA_GROUP = '/stock/bd-examine-group/update', //编辑
  DELETE_EXA_GROUP = '/stock/bd-examine-group/delete',
  QUERY_ONE_EXA_GROUP = '/stock/bd-examine-group/query-one',
  TREE_EXA_GROUP = '/stock/bd-examine-group/tree',
  GET_EXA_PROJECT_LIST = '/stock/bd-examine-project/list', //检验项目列表
  AUDIT_EXA_PROJECT = '/stock/bd-examine-project/audit', //检验项目审核
  BATCH_AUDIT_EXA_PROJECT = '/stock/bd-examine-project/batch-audit', //检验项目批量审核
  UN_AUDIT_EXA_PROJECT = '/stock/bd-examine-project/un-audit', //反审核检验项目
  BATCH_UN_AUDIT_EXA_PROJECT = '/stock/bd-examine-project/batch-un-audit', //检验项目批量反审核
  BATCH_DEL_EXA_PROJECT = '/stock/bd-examine-project/batch-delete', //删除检验项目
  GET_EXA_PROJECT_DTO = '/stock/bd-examine-project/query-dto', //获取检验项目实体信息
  ADD_EXA_PROJECT = '/stock/bd-examine-project/save', //新增
  QUERY_ONE_EXA_PROJECT = '/stock/bd-examine-project/query-one',
  UPDATE_EXA_PROJECT = '/stock/bd-examine-project/update',
  DEL_EXA_PROJECT = '/stock/bd-examine-project/delete',
  EXPORT_EXA_PROJECT = '/stock/bd-examine-project/export-list',
  IMPORT_EXA_PROJECT = '/stock/bd-examine-project/import-model',
  UPLOAD_EXA_PROJECT = 'http://192.168.200.136:9999/stock/bd-examine-project/import-list',

  //检验规则
  GET_EXA_RULE_DTO = '/stock/bd-examine-rule/query-dto', //检验规则实体
  GET_EXA_RULE_LIST = '/stock/bd-examine-rule/list',
  ADD_EXA_RULE = '/stock/bd-examine-rule/save',
  UPDATE_EXA_RULE = '/stock/bd-examine-rule/update',
  AUDIT_EXA_RULE = '/stock/bd-examine-rule/audit',
  BATCH_AUDIT_EXA_RULE = '/stock/bd-examine-rule/batch-audit',
  QUERY_ONE_EXA_RULE = '/stock/bd-examine-rule/query-one',
  DEL_EXA_RULE = '/stock/bd-examine-rule/delete',
  BATCH_DEL_EXA_RULE = '/stock/bd-examine-rule/batch-delete',
  UN_AUDIT_EXA_RULE = '/stock/bd-examine-rule/un-audit',
  BATCH_UN_AUDIT_EXA_RULE = '/stock/bd-examine-rule/batch-un-audit',
  EXPORT_EXA_RULE = '/stock/bd-examine-rule/export-list',
  IMPORT_EXA_RULE = '/stock/bd-examine-rule/import-model',
  UPLOAD_EXA_RULE = 'http://192.168.200.136:9999/stock/bd-examine-rule/import-list',

  //检验方案
  GET_EXA_SCHEME_LIST = '/stock/bd-examine/list',
  AUDIT_EXA_SCHEME = '/stock/bd-examine/audit',
  BATCH_AUDIT_EXA_SCHEME = '/stock/bd-examine/batch-audit',
  UN_AUDIT_EXA_SCHEME = '/stock/bd-examine/un-audit',
  BATCH_UN_AUDIT_EXA_SCHEME = '/stock/bd-examine/batch-un-audit',
  BATCH_DEL_EXA_SCHEME = '/stock/bd-examine/batch-delete',
  GET_EXA_SCHEME_DTO = '/stock/bd-examine/query-dto',
  ADD_EXA_SCHEME = '/stock/bd-examine/save',
  QUERY_ONE_EXA_SCHEME = '/stock/bd-examine/query-one',
  UPDATE_EXA_SCHEME = '/stock/bd-examine/update',
  DEL_EXA_SCHEME = '/stock/bd-examine/delete',
  EXPORT_EXA_SCHEME = '/stock/bd-examine/export-list',
  IMPORT_EXA_SCHEME = '/stock/bd-examine/import-model',
  UPLOAD_EXA_SCHEME = 'http://192.168.200.136:9999/stock/bd-examine/import-list',

  //分仓管理
  AUDIT_STOCK_COMPARTMENT_LIST = '/stock/bd-stock-compartment/audit',
  BATCH_AUDIT_STOCK_COMPARTMENT_LIST = '/stock/bd-stock-compartment/batch-audit',
  UN_AUDIT_STOCK_COMPARTMENT_LIST = '/stock/bd-stock-compartment/un-audit',
  UN_BATCH_AUDIT_STOCK_COMPARTMENT_LIST = '/stock/bd-stock-compartment/batch-un-audit',
  DELETE_STOCK_COMPARTMENT_LIST = '/stock/bd-stock-compartment/delete',
  BATCH_DELETE_STOCK_COMPARTMENT_LIST = '/stock/bd-stock-compartment/batch-delete',
  GET_PAGE_STOCK_COMPARTMENT_LIST = '/stock/bd-stock-compartment/list', //获取分仓列表
  GET_ID_STOCK_COMPARTMENT_LIST = '/stock/bd-stock-compartment/getOne', //查询单条
  IMPORT_STOCK_COMPARTMENT_LIST = 'http://192.168.200.136:9999/stock/bd-stock-compartment/import-list',
  IMPORT_MODEL_STOCK_COMPARTMENT_LIST = '/stock/bd-stock-compartment/import-model',
  EXPORT_STOCK_COMPARTMENT_LIST = '/stock/bd-stock-compartment/export-list',
  ADD_STOCK_COMPARTMENT_LIST = '/stock/bd-stock-compartment/save',
  UPDATE_STOCK_COMPARTMENT_LIST = '/stock/bd-stock-compartment/update',

  //仓位管理
  AUDIT_STOCK_LOCATION_LIST = '/stock/bd-stock-location/audit',
  BATCH_AUDIT_STOCK_LOCATION = '/stock/bd-stock-location/batch-audit',
  UN_AUDIT_STOCK_LOCATION_LIST = '/stock/bd-stock-location/un-audit',
  UN_BATCH_AUDIT_STOCK_LOCATION = '/stock/bd-stock-location/batch-un-audit',
  DELETE_STOCK_LOCATION_LIST = '/stock/bd-stock-location/delete',
  BATCH_DELETE_STOCK_LOCATION = '/stock/bd-stock-location/batch-delete',
  GET_PAGE_STOCK_LOCATION_LIST = '/stock/bd-stock-location/list', //获取仓位列表
  // GET_LIST_STOCK_LOCATION = '/stock/bd-stock-location/list', //分页查询
  GET_ID_STOCK_LOCATION_LIST = '/stock/bd-stock-location/getOne', //查询单条
  IMPORT_STOCK_LOCATION_LIST = 'http://192.168.200.136:9999/stock/bd-stock-location/import-list',
  IMPORT_MODEL_STOCK_LOCATION = '/stock/bd-stock-location/import-model',
  EXPORT_STOCK_LOCATION_LIST = '/stock/bd-stock-location/export-list',
  ADD_STOCK_LOCATION_LIST = '/stock/bd-stock-location/save',
  UPDATE_STOCK_LOCATION_LIST = '/stock/bd-stock-location/update',

  //国家地区
  COUNTRY_TREE = '/stock/bd-country/getCountryByParentId',
  GET_COUNTRY_DTO = '/stock/bd-country/query-dto',

  //计量单位
  AUDIT_UNIT_LIST = '/stock/bd-unit/audit', //审核
  BATCH_AUDIT_UNIT_LIST = '/stock/bd-unit/batch-audit', //批量审核
  UN_AUDIT_UNIT_LIST = '/stock/bd-unit/un-audit', //反审核
  UN_BATCH_AUDIT_UNIT_LIST = '/stock/bd-unit/batch-un-audit', //批量反审核
  DELETE_UNIT_LIST = '/stock/bd-unit/delete', //删除
  BATCH_DELETE_UNIT_LIST = '/stock/bd-unit/batch-delete', //批量删除
  GET_PAGE_UNIT_LIST = '/stock/bd-unit/list', //分页查询--获取计量单位
  GET_ONE_UNIT_LIST = '/stock/bd-unit/query-one', //查询单条
  IMPORT_UNIT_LIST = 'http://192.168.200.136:9999/stock/bd-unit/import-list', //导入
  IMPORT_MODEL_UNIT = '/stock/bd-unit/import-model', //导入模板下载
  EXPORT_UNIT_LIST = '/stock/bd-unit/export-list', //导出
  ADD_UNIT_LIST = '/stock/bd-unit/save', //添加
  UPDATE_UNIT_LIST = '/stock/bd-unit/update', //编辑

  //即时库存
  GET_INV_ADD_STOCK = '/stock/bd-inventory/add-stock', //增加库存
  GET_INV_BY_MAT_STOCK_LIST = '/stock/bd-inventory/get-inv-by-mat-stock', //物料号与仓位获取库存信息
  GET_INV_LIST = '/stock/bd-inventory/list', //分页查询
  GET_INV_REDUCE_STOCK = '/stock/bd-inventory/reduce-stock', //减少库存

  // 盘盈单
  AUDIT_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/audit', //审核
  BATCH_AUDIT_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/batch-audit', //批量审核
  UN_AUDIT_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/un-audit', //反审核
  UN_BATCH_AUDIT_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/batch-un-audit', //批量反审核
  DELETE_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/delete', //删除
  BATCH_DELETE_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/batch-delete', //批量删除
  BATCH_DELETE_WITH_DETAIL_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/delete-with-detail-batch', //批量删除含详情信息
  DELETE_WITH_DETAIL_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/delete-with-detail', //删除含详情信息
  GET_PAGE_INV_COUNT_GAIN_LIST = '/wms/bd-inventory-count-gain/list', //分页查询--获取列表
  GET_INV_COUNT_GAIN_DTO = '/wms/bd-inventory-count-gain/query-dto', //获取实体信息
  GET_ONE_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/query-one', //查询单条
  IMPORT_INV_COUNT_GAIN = 'http://192.168.200.136:9999/wms/bd-inventory-count-gain/import-list', //导入
  IMPORT_MODEL_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/import-model', //导入模板下载
  EXPORT_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/export-list', //导出
  ADD_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/save', //添加
  ADD_WITH_DETAIL_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/save-with-detail', //添加含详情信息
  UPDATE_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/update', //编辑
  PUSHDOWN_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/push/', //下推
  DOWN_SEARCH_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/down-search', //下查
  UP_SEARCH_INV_COUNT_GAIN = '/wms/bd-inventory-count-gain/up-search', //上查

  // 盘点单
  AUDIT_INV_COUNT = '/wms/bd-inventory-count/audit', //审核
  BATCH_AUDIT_INV_COUNT = '/wms/bd-inventory-count/batch-audit', //批量审核
  UN_AUDIT_INV_COUNT = '/wms/bd-inventory-count/un-audit', //反审核
  UN_BATCH_AUDIT_INV_COUNT = '/wms/bd-inventory-count/batch-un-audit', //批量反审核
  DELETE_INV_COUNT = '/wms/bd-inventory-count/delete', //删除
  BATCH_DELETE_INV_COUNT = '/wms/bd-inventory-count/batch-delete', //批量删除
  BATCH_DELETE_WITH_DETAIL_INV_COUNT = '/wms/bd-inventory-count/delete-with-detail-batch', //批量删除含详情信息
  DELETE_WITH_DETAIL_INV_COUNT = '/wms/bd-inventory-count/delete-with-detail', //删除含详情信息
  GET_PAGE_INV_COUNT_LIST = '/wms/bd-inventory-count/list', //分页查询--获取列表
  GET_INV_COUNT_DTO = '/wms/bd-inventory-count/query-dto', //获取实体信息
  GET_ONE_INV_COUNT = '/wms/bd-inventory-count/query-one', //查询单条
  IMPORT_INV_COUNT = 'http://192.168.200.136:9999/wms/bd-inventory-count/import-list', //导入
  IMPORT_MODEL_INV_COUNT = '/wms/bd-inventory-count/import-model', //导入模板下载
  EXPORT_INV_COUNT = '/wms/bd-inventory-count/export-list', //导出
  ADD_INV_COUNT = '/wms/bd-inventory-count/save', //添加
  ADD_WITH_DETAIL_INV_COUNT = '/wms/bd-inventory-count/save-with-detail', //添加含详情信息
  UPDATE_INV_COUNT = '/wms/bd-inventory-count/update', //编辑
  PUSHDOWN_INV_COUNT = '/wms/bd-inventory-count/push/', //下推
  DOWN_SEARCH_INV_COUNT = '/wms/bd-inventory-count/down-search', //下查
  UP_SEARCH_INV_COUNT = '/wms/bd-inventory-count/up-search', //上查
  //下推查询配置
  GET_PUSHDOWN_LIST = '/wms/lk-set/list', //下推查询配置

  // 盘亏单
  AUDIT_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/audit', //审核
  BATCH_AUDIT_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/batch-audit', //批量审核
  UN_AUDIT_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/un-audit', //反审核
  UN_BATCH_AUDIT_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/batch-un-audit', //批量反审核
  // DELETE_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/delete', //删除
  // BATCH_DELETE_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/batch-delete', //批量删除
  BATCH_DELETE_WITH_DETAIL_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/delete-with-detail-batch', //批量删除含详情信息
  DELETE_WITH_DETAIL_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/delete-with-detail', //删除含详情信息
  GET_PAGE_INV_COUNT_LOSS_LIST = '/wms/bd-inventory-count-loss/list', //分页查询--获取列表
  GET_INV_COUNT_LOSS_DTO = '/wms/bd-inventory-count-loss/query-dto', //获取实体信息
  GET_ONE_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/query-one', //查询单条
  IMPORT_INV_COUNT_LOSS = 'http://192.168.200.136:9999/wms/bd-inventory-count-loss/import-list', //导入
  IMPORT_MODEL_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/import-model', //导入模板下载
  EXPORT_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/export-list', //导出
  // ADD_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/save', //添加
  ADD_WITH_DETAIL_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/save-with-detail', //添加含详情信息
  UPDATE_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/update', //编辑
  PUSHDOWN_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/push/', //下推
  DOWN_SEARCH_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/down-search', //下查
  UP_SEARCH_INV_COUNT_LOSS = '/wms/bd-inventory-count-loss/up-search', //上查

  //系统参数
  GET_SYSTEM_LIST = '/stock/bd-system/list', //系统参数查询
  GET_SYSTEM_IS_NE_STOCK = '/stock/bd-system/is-ne-stock', //查询是否允许负库存
  GET_SYSTEM_STOCK_DIS = '/stock/bd-system/stock-dis', //查询仓库维度
  UPDATE_SYSTEM = '/stock/bd-system/update', //更新系统参数

  // 采购订单
  AUDIT_PURCHASE_ORDER = '/wms/purchaseOrder/audit', //审核
  BATCH_AUDIT_PURCHASE_ORDER = '/wms/purchaseOrder/batch-audit', //批量审核
  UN_AUDIT_PURCHASE_ORDER = '/wms/purchaseOrder/un-audit', //反审核
  UN_BATCH_AUDIT_PURCHASE_ORDER = '/wms/purchaseOrder/batch-un-audit', //批量反审核
  DELETE_PURCHASE_ORDER = '/wms/purchaseOrder/delete', //删除
  BATCH_DELETE_PURCHASE_ORDER = '/wms/purchaseOrder/batch-delete', //批量删除
  BATCH_DELETE_WITH_DETAIL_PURCHASE_ORDER = '/wms/purchaseOrder/delete-with-detail-batch', //批量删除含详情信息
  DELETE_WITH_DETAIL_PURCHASE_ORDER = '/wms/purchaseOrder/delete-with-detail', //删除含详情信息
  GET_PAGE_PURCHASE_ORDER_LIST = '/wms/purchaseOrder/list', //分页查询--获取列表
  GET_PURCHASE_ORDER_DTO = '/wms/purchaseOrder/query-dto', //获取实体信息
  GET_ONE_PURCHASE_ORDER = '/wms/purchaseOrder/query-one', //查询单条
  IMPORT_PURCHASE_ORDER = 'http://192.168.200.136:9999/wms/purchaseOrder/import-list', //导入
  IMPORT_MODEL_PURCHASE_ORDER = '/wms/purchaseOrder/import-model', //导入模板下载
  EXPORT_PURCHASE_ORDER = '/wms/purchaseOrder/export-list', //导出
  ADD_PURCHASE_ORDER = '/wms/purchaseOrder/save', //添加
  ADD_WITH_DETAIL_PURCHASE_ORDER = '/wms/purchaseOrder/save-with-detail', //添加含详情信息
  UPDATE_PURCHASE_ORDER = '/wms/purchaseOrder/update', //编辑
  PUSHDOWN_PURCHASE_ORDER = '/wms/purchaseOrder/push/', //下推
  DOWN_SEARCH_PURCHASE_ORDER = '/wms/purchaseOrder/down-search', //下查
  UP_SEARCH_PURCHASE_ORDER = '/wms/purchaseOrder/up-search', //上查

  // 采购入库
  AUDIT_PURCHASE_INSTOCK = '/wms/purchaseInStock/audit', //审核
  BATCH_AUDIT_PURCHASE_INSTOCK = '/wms/purchaseInStock/batch-audit', //批量审核
  UN_AUDIT_PURCHASE_INSTOCK = '/wms/purchaseInStock/un-audit', //反审核
  UN_BATCH_AUDIT_PURCHASE_INSTOCK = '/wms/purchaseInStock/batch-un-audit', //批量反审核
  DELETE_PURCHASE_INSTOCK = '/wms/purchaseInStock/delete', //删除
  BATCH_DELETE_PURCHASE_INSTOCK = '/wms/purchaseInStock/batch-delete', //批量删除
  BATCH_DELETE_WITH_DETAIL_PURCHASE_INSTOCK = '/wms/purchaseInStock/delete-with-detail-batch', //批量删除含详情信息
  DELETE_WITH_DETAIL_PURCHASE_INSTOCK = '/wms/purchaseInStock/delete-with-detail', //删除含详情信息
  GET_PAGE_PURCHASE_INSTOCK_LIST = '/wms/purchaseInStock/list', //分页查询--获取列表
  GET_PURCHASE_INSTOCK_DTO = '/wms/purchaseInStock/query-dto', //获取实体信息
  GET_ONE_PURCHASE_INSTOCK = '/wms/purchaseInStock/query-one', //查询单条
  IMPORT_PURCHASE_INSTOCK = 'http://192.168.200.136:9999/wms/purchaseInStock/import-list', //导入
  IMPORT_MODEL_PURCHASE_INSTOCK = '/wms/purchaseInStock/import-model', //导入模板下载
  EXPORT_PURCHASE_INSTOCK = '/wms/purchaseInStock/export-list', //导出
  ADD_PURCHASE_INSTOCK = '/wms/purchaseInStock/save', //添加
  ADD_WITH_DETAIL_PURCHASE_INSTOCK = '/wms/purchaseInStock/save-with-detail', //添加含详情信息
  UPDATE_PURCHASE_INSTOCK = '/wms/purchaseInStock/update', //编辑
  PUSHDOWN_PURCHASE_INSTOCK = '/wms/purchaseInStock/push/', //下推
  DOWN_SEARCH_PURCHASE_INSTOCK = '/wms/purchaseInStock/down-search', //下查
  UP_SEARCH_PURCHASE_INSTOCK = '/wms/purchaseInStock/up-search', //上查

  // 采购退货
  AUDIT_PURCHASE_RETURN = '/wms/purchaseReturn/audit', //审核
  BATCH_AUDIT_PURCHASE_RETURN = '/wms/purchaseReturn/batch-audit', //批量审核
  UN_AUDIT_PURCHASE_RETURN = '/wms/purchaseReturn/un-audit', //反审核
  UN_BATCH_AUDIT_PURCHASE_RETURN = '/wms/purchaseReturn/batch-un-audit', //批量反审核
  DELETE_PURCHASE_RETURN = '/wms/purchaseReturn/delete', //删除
  BATCH_DELETE_PURCHASE_RETURN = '/wms/purchaseReturn/batch-delete', //批量删除
  BATCH_DELETE_WITH_DETAIL_PURCHASE_RETURN = '/wms/purchaseReturn/delete-with-detail-batch', //批量删除含详情信息
  DELETE_WITH_DETAIL_PURCHASE_RETURN = '/wms/purchaseReturn/delete-with-detail', //删除含详情信息
  GET_PAGE_PURCHASE_RETURN_LIST = '/wms/purchaseReturn/list', //分页查询--获取列表
  GET_PURCHASE_RETURN_DTO = '/wms/purchaseReturn/query-dto', //获取实体信息
  GET_ONE_PURCHASE_RETURN = '/wms/purchaseReturn/query-one', //查询单条
  IMPORT_PURCHASE_RETURN = 'http://192.168.200.136:9999/wms/purchaseReturn/import-list', //导入
  IMPORT_MODEL_PURCHASE_RETURN = '/wms/purchaseReturn/import-model', //导入模板下载
  EXPORT_PURCHASE_RETURN = '/wms/purchaseReturn/export-list', //导出
  ADD_PURCHASE_RETURN = '/wms/purchaseReturn/save', //添加
  ADD_WITH_DETAIL_PURCHASE_RETURN = '/wms/purchaseReturn/save-with-detail', //添加含详情信息
  UPDATE_PURCHASE_RETURN = '/wms/purchaseReturn/update', //编辑
  PUSHDOWN_PURCHASE_RETURN = '/wms/purchaseReturn/push/', //下推
  DOWN_SEARCH_PURCHASE_RETURN = '/wms/purchaseReturn/down-search', //下查
  UP_SEARCH_PURCHASE_RETURN = '/wms/purchaseReturn/up-search', //上查

  // 生产订单
  AUDIT_PRODUCE_ORDER = '/wms/bs-pro-mo/audit', //审核
  BATCH_AUDIT_PRODUCE_ORDER = '/wms/bs-pro-mo/batch-audit', //批量审核
  UN_AUDIT_PRODUCE_ORDER = '/wms/bs-pro-mo/un-audit', //反审核
  UN_BATCH_AUDIT_PRODUCE_ORDER = '/wms/bs-pro-mo/batch-un-audit', //批量反审核
  DELETE_PRODUCE_ORDER = '/wms/bs-pro-mo/delete', //删除
  BATCH_DELETE_PRODUCE_ORDER = '/wms/bs-pro-mo/batch-delete', //批量删除
  BATCH_DELETE_WITH_DETAIL_PRODUCE_ORDER = '/wms/bs-pro-mo/delete-with-detail-batch', //批量删除含详情信息
  DELETE_WITH_DETAIL_PRODUCE_ORDER = '/wms/bs-pro-mo/delete-with-detail', //删除含详情信息
  GET_PAGE_PRODUCE_ORDER_LIST = '/wms/bs-pro-mo/list', //分页查询--获取列表
  GET_PRODUCE_ORDER_DTO = '/wms/bs-pro-mo/query-dto', //获取实体信息
  GET_ONE_PRODUCE_ORDER = '/wms/bs-pro-mo/query-one', //查询单条
  IMPORT_PRODUCE_ORDER = 'http://192.168.200.136:9999/wms/bs-pro-mo/import-list', //导入
  IMPORT_MODEL_PRODUCE_ORDER = '/wms/bs-pro-mo/import-model', //导入模板下载
  EXPORT_PRODUCE_ORDER = '/wms/bs-pro-mo/export-list', //导出
  ADD_PRODUCE_ORDER = '/wms/bs-pro-mo/save', //添加
  ADD_WITH_DETAIL_PRODUCE_ORDER = '/wms/bs-pro-mo/save-with-detail', //添加含详情信息
  UPDATE_PRODUCE_ORDER = '/wms/bs-pro-mo/update', //编辑
  PUSHDOWN_PRODUCE_ORDER = '/wms/bs-pro-mo/push/', //下推
  DOWN_SEARCH_PRODUCE_ORDER = '/wms/bs-pro-mo/down-search', //下查
  UP_SEARCH_PRODUCE_ORDER = '/wms/bs-pro-mo/up-search', //上查

  // 生产入库
  AUDIT_PRODUCE_ORDER_INSTOCK = '/wms/bs-pro-mo-in-stock/audit', //审核
  BATCH_AUDIT_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/batch-audit', //批量审核
  UN_AUDIT_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/un-audit', //反审核
  UN_BATCH_AUDIT_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/batch-un-audit', //批量反审核
  DELETE_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/delete', //删除
  BATCH_DELETE_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/batch-delete', //批量删除
  BATCH_DELETE_WITH_DETAIL_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/delete-with-detail-batch', //批量删除含详情信息
  DELETE_WITH_DETAIL_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/delete-with-detail', //删除含详情信息
  GET_PAGE_PRODUCE_INSTOCK_LIST = '/wms/bs-pro-mo-in-stock/list', //分页查询--获取列表
  GET_PRODUCE_INSTOCK_DTO = '/wms/bs-pro-mo-in-stock/query-dto', //获取实体信息
  GET_ONE_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/query-one', //查询单条
  IMPORT_PRODUCE_INSTOCK = 'http://192.168.200.136:9999/wms/bs-pro-mo-in-stock/import-list', //导入
  IMPORT_MODEL_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/import-model', //导入模板下载
  EXPORT_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/export-list', //导出
  ADD_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/save', //添加
  ADD_WITH_DETAIL_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/save-with-detail', //添加含详情信息
  UPDATE_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/update', //编辑
  PUSHDOWN_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/push/', //下推
  DOWN_SEARCH_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/down-search', //下查
  UP_SEARCH_PRODUCE_INSTOCK = '/wms/bs-pro-mo-in-stock/up-search', //上查

  // 用料清单
  AUDIT_PRODUCE_ORDER_BOM = '/wms/bs-pro-mo-order/audit', //审核
  BATCH_AUDIT_PRODUCE_BOM = '/wms/bs-pro-mo-order/batch-audit', //批量审核
  UN_AUDIT_PRODUCE_BOM = '/wms/bs-pro-mo-order/un-audit', //反审核
  UN_BATCH_AUDIT_PRODUCE_BOM = '/wms/bs-pro-mo-order/batch-un-audit', //批量反审核
  DELETE_PRODUCE_BOM = '/wms/bs-pro-mo-order/delete', //删除
  BATCH_DELETE_PRODUCE_BOM = '/wms/bs-pro-mo-order/batch-delete', //批量删除
  BATCH_DELETE_WITH_DETAIL_PRODUCE_BOM = '/wms/bs-pro-mo-order/delete-with-detail-batch', //批量删除含详情信息
  DELETE_WITH_DETAIL_PRODUCE_BOM = '/wms/bs-pro-mo-order/delete-with-detail', //删除含详情信息
  GET_PAGE_PRODUCE_BOM_LIST = '/wms/bs-pro-mo-order/list', //分页查询--获取列表
  GET_PRODUCE_BOM_DTO = '/wms/bs-pro-mo-order/query-dto', //获取实体信息
  GET_ONE_PRODUCE_BOM = '/wms/bs-pro-mo-order/query-one', //查询单条
  IMPORT_PRODUCE_BOM = 'http://192.168.200.136:9999/wms/bs-pro-mo-order/import-list', //导入
  IMPORT_MODEL_PRODUCE_BOM = '/wms/bs-pro-mo-order/import-model', //导入模板下载
  EXPORT_PRODUCE_BOM = '/wms/bs-pro-mo-order/export-list', //导出
  ADD_PRODUCE_BOM = '/wms/bs-pro-mo-order/save', //添加
  ADD_WITH_DETAIL_PRODUCE_BOM = '/wms/bs-pro-mo-order/save-with-detail', //添加含详情信息
  UPDATE_PRODUCE_BOM = '/wms/bs-pro-mo-order/update', //编辑
  PUSHDOWN_PRODUCE_BOM = '/wms/bs-pro-mo-order/push/', //下推
  DOWN_SEARCH_PRODUCE_BOM = '/wms/bs-pro-mo-order/down-search', //下查
  UP_SEARCH_PRODUCE_BOM = '/wms/bs-pro-mo-order/up-search', //上查
}
//用于高级查询--基本信息查询下拉框字段
export const TableColum = {
  //计量（基本）单位表头
  GET_UNIT_DTO: [
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '单位编码', sortable: true },
    { field: 'name', title: '单位名称', sortable: true },
    { field: 'bsType', title: '单位类型', slots: { default: 'bsType' }, sortable: true },
    {
      field: 'createBy',
      title: '创建人',
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建日期',
      sortable: true,
    },
    {
      field: 'updateBy',
      title: '修改人',
      sortable: true,
    },
    {
      field: 'updateTime',
      title: '修改日期',
      sortable: true,
    },
    {
      field: 'bsStatus',
      title: '数据状态',
      sortable: true,
      slots: { default: 'status' },
    },
  ],
  //仓库
  GET_STOCK_DTO: [
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '仓库编码', sortable: true },
    { field: 'name', title: '仓库名称', sortable: true },
    { field: 'address', title: '仓库地址', sortable: true },
    { field: 'bdEmployee.name', title: '仓库管理员', sortable: true },
    { field: 'phone', title: '联系电话', sortable: true },
    {
      field: 'bsStatus',
      title: '数据状态',
      sortable: true,
      slots: { default: 'status' },
    },
  ],
  //分仓
  GET_SUB_STOCK_DTO: [
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '分仓编码', sortable: true },
    { field: 'name', title: '分仓名称', sortable: true },
    { field: 'address', title: '仓库地址', sortable: true },
    { field: 'bdEmployee.name', title: '仓库管理员', sortable: true },
    { field: 'phone', title: '联系电话', sortable: true },
    {
      field: 'bsStatus',
      title: '数据状态',
      sortable: true,
      slots: { default: 'status' },
    },
  ],
  //仓位
  GET_LOCATION_DTO: [
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '仓位编码', sortable: true },
    { field: 'name', title: '仓位名称', sortable: true },
    { field: 'address', title: '仓位地址', sortable: true },
    { field: 'bdEmployee.name', title: '仓位管理员', sortable: true },
    { field: 'phone', title: '联系电话', sortable: true },
    {
      field: 'bsStatus',
      title: '数据状态',
      sortable: true,
      slots: { default: 'status' },
    },
  ],
  //国家地区
  GET_COUNTRY_DTO: [
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '编码', sortable: true },
    { field: 'name', title: '名称', sortable: true },
    { field: 'createTime', title: '创建时间', sortable: true },
    { field: 'updateTime', title: '修改时间', sortable: true },
    {
      field: 'bsStatus',
      title: '数据状态',
      sortable: true,
      slots: { default: 'status' },
    },
  ],
  GET_SUPPLIER_DTO: [
    { type: 'checkbox', width: 50 },
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '编码', width: 120, sortable: true },
    { field: 'name', title: '供应商', sortable: true, width: 120 },
    { field: 'shortName', title: '供应商简称', sortable: true, width: 120 },
    { field: 'contact', title: '联系人', sortable: true, width: 120 },
    { field: 'phone', title: '联系电话', sortable: true, width: 120 },
    { field: 'bdEmployee.name', title: '负责人', sortable: true, width: 120 },
    { field: 'address', title: '地址', sortable: true, width: 120 },
    {
      field: 'level',
      title: '等级',
      sortable: true,
      slots: { default: 'SupplierLevel' },
      width: 120,
    },
    { field: 'bdCountryCountry.name', title: '国家', sortable: true, width: 120 },
    { field: 'bdCountryProvincial.name', title: '省', sortable: true, width: 120 },
    { field: 'bdCountryMunicipal.name', title: '市', sortable: true, width: 120 },
    { field: 'bdCountryDistrict.name', title: '区', sortable: true, width: 120 },
    { field: 'bdSupplierGroup.name', title: '供应商分组', sortable: true, width: 120 },
    { field: 'createTime', title: '创建日期', sortable: true, width: 160 },
    { field: 'updateTime', title: '修改日期', sortable: true, width: 160 },
    {
      field: 'bsStatus',
      title: '业务状态',
      slots: { default: 'status' },
      width: 120,
    },
  ],

  //检验方案
  GET_EXA_PROJECT_DTO: [
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '项目编码', sortable: true },
    { field: 'name', title: '项目名称', sortable: true },
    // { field: 'bdExamineGroup.name', title: '检验类别', sortable: true },
    { field: 'description', title: '描述', sortable: true },
    // { field: 'isOpen', title: '启用状态', sortable: true, slots: { default: 'open' } },
    {
      field: 'bsStatus',
      title: '数据状态',
      sortable: true,
      slots: { default: 'status' },
    },
  ],
  //抽检规则
  GET_EXA_RULE_DTO: [
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '规则编码', sortable: true },
    { field: 'name', title: '规则名称', sortable: true },
    // { field: 'bdExamineGroup.name', title: '检验类别', sortable: true },
    { field: 'min', title: '最小数', sortable: true },
    { field: 'max', title: '最大数', sortable: true },
    { field: 'percent', title: '抽检百分比', sortable: true },
    // { field: 'isOpen', title: '启用状态', sortable: true, slots: { default: 'open' } },
    {
      field: 'bsStatus',
      title: '数据状态',
      sortable: true,
      slots: { default: 'status' },
    },
  ],
  //盘盈单
  GET_INV_COUNT_GAIN_DTO: [
    { type: 'checkbox', width: 50 },
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '单据编号', sortable: true },
    { field: 'dtLk.srcBill', title: '来源单号', sortable: true },
    { field: 'dtData.bdMaterial.number', title: '物料编号', sortable: true },
    { field: 'dtData.bdMaterial.name', title: '物料名称', sortable: true },
    { field: 'dtData.bdMaterial.model', title: '规格型号', sortable: true },
    { field: 'dtData.baseUnitName', title: '单位', sortable: true },
    { field: 'stockNum', title: '帐存数量', sortable: true },
    { field: 'gain', title: '盘盈数量', sortable: true },
    { field: 'way', title: '盘点方式', sortable: true }, //普通盘点，全盘点
    { field: 'empId', title: '盘点人', sortable: true },
    { field: 'bsDate', title: '盘点日期', sortable: true },
    { field: 'dtData.bdStock.name', title: '仓库', sortable: true },
    { field: 'dtData.bdStockCompartment.name', title: '分仓', sortable: true },
    { field: 'dtData.location.name', title: '仓位', sortable: true },
    {
      field: 'bsStatus',
      title: '数据状态',
      sortable: true,
      slots: { default: 'status' },
    },
  ],

  //盘亏单
  GET_INV_COUNT_LOSS_DTO: [
    { type: 'checkbox', width: 50 },
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '单据编号', sortable: true },
    { field: 'dtLk.srcBill', title: '来源单号', sortable: true },
    { field: 'dtData.bdMaterial.number', title: '物料编号', sortable: true },
    { field: 'dtData.bdMaterial.name', title: '物料名称', sortable: true },
    { field: 'dtData.bdMaterial.model', title: '规格型号', sortable: true },
    { field: 'dtData.baseUnitName', title: '单位', sortable: true },
    { field: 'stockNum', title: '帐存数量', sortable: true },
    { field: 'loss', title: '盘亏数量', sortable: true },
    { field: 'way', title: '盘点方式', sortable: true }, //普通盘点，全盘点
    { field: 'empId', title: '盘点人', sortable: true },
    { field: 'bsDate', title: '盘点日期', sortable: true },
    { field: 'dtData.bdStock.name', title: '仓库', sortable: true },
    { field: 'dtData.bdStockCompartment.name', title: '分仓', sortable: true },
    { field: 'dtData.location.name', title: '仓位', sortable: true },
    {
      field: 'bsStatus',
      title: '数据状态',
      sortable: true,
      slots: { default: 'status' },
    },
  ],
  //物料信息表头
  GET_MAT_DTO: [
    { type: 'checkbox', width: 50 },
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '物料编码', sortable: true, width: 120 },
    { field: 'name', title: '物料名称', sortable: true, width: 120 },
    { field: 'model', title: '规格型号', sortable: true, width: 120 },
    { field: 'baseUnit.name', title: '基本单位', sortable: true, width: 120 },
    { field: 'weightUnit.name', title: '重量单位', sortable: true, width: 120 },
    { field: 'bdStock.name', title: '仓库', sortable: true, width: 120 },
    { field: 'bdStockCompartment.name', title: '分仓', sortable: true, width: 120 },
    { field: 'bdStockLocation.name', title: '仓位', sortable: true, width: 120 },
    { field: 'bdMaterialGroup.name', title: '物料分组', sortable: true, width: 120 },
    {
      field: 'attr',
      title: '物料属性',
      sortable: true,
      slots: { default: 'attr' },
      width: 120,
    },
    {
      field: 'bsStatus',
      title: '数据状态',
      sortable: true,
      width: 120,
      slots: { default: 'status' },
    },
  ],
  //检验方案
  GET_EXA_SCHEME_DTO: [
    { type: 'checkbox', width: 50 },
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '方案编码', sortable: true },
    { field: 'name', title: '方案名称', sortable: true },
    { field: 'updateBy', title: '修改人员', sortable: true },
    { field: 'updateTime', title: '修改时间', sortable: true },
    {
      field: 'bsStatus',
      title: '数据状态',
      sortable: true,
      slots: { default: 'status' },
    },
  ],
  //客户实体信息表头
  GET_CUSTOMER_DTO: [
    { type: 'checkbox', width: 50 },
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '编码', width: 120, sortable: true },
    { field: 'name', title: '客户', sortable: true, width: 120 },
    { field: 'shortName', title: '客户简称', sortable: true, width: 120 },
    { field: 'contact', title: '联系人', sortable: true, width: 120 },
    { field: 'phone', title: '联系电话', sortable: true, width: 120 },
    { field: 'address', title: '地址', sortable: true, width: 120 },
    { field: 'bdCountryCountry.name', title: '国家', sortable: true, width: 120 },
    { field: 'bdCountryProvincial.name', title: '省', sortable: true, width: 120 },
    { field: 'bdCountryMunicipal.name', title: '市', sortable: true, width: 120 },
    { field: 'bdCountryDistrict.name', title: '区', sortable: true, width: 120 },
    { field: 'bdCustomerGroup.name', title: '客户分组', sortable: true, width: 120 },
    { field: 'createTime', title: '创建日期', sortable: true, width: 160 },
    { field: 'updateTime', title: '修改日期', sortable: true, width: 160 },
    {
      field: 'attr',
      title: '物料属性',
      sortable: true,
      slots: { default: 'attr' },
      width: 120,
    },
  ],
  //人员档案
  GET_EMPLOYEE_DTO: [
    { type: 'seq', title: '序号', width: 50 },
    { field: 'number', title: '编码', sortable: true },
    { field: 'name', title: '人员名称', sortable: true },
    { field: 'entryDate', title: '入职日期', sortable: true },
    { field: 'birthday', title: '出生日期', sortable: true },
    { field: 'address', title: '地址', sortable: true },
    { field: 'mark', title: '备注', sortable: true },
    {
      field: 'bsStatus',
      title: '数据状态',
      sortable: true,
      slots: { default: 'status' },
    },
  ],
};

//公共属性
export enum SearchLink {
  AND = 'AND',
  OR = 'OR',
}
export enum SearchMatchType {
  EQ = 'EQ', //等于
  LIKE = 'LIKE', //包含
  GE = 'GE', //大于等于
  LE = 'LE', //小于等于
  NE = 'NE', //不等于
  GT = 'GT', //大于
  LT = 'LT', //小于
  IN = 'IN', //数组包含
}
export enum SearchDataType {
  string = 'string',
  number = 'number',
}
export interface OrderByBean {
  ascList?: string[];
  descList?: string[];
}
export interface RequestData<T> {
  pageIndex?: number;
  pageRows?: number;
  orderByBean?: OrderByBean;
  params: T;
}
export interface SearchParams {
  table: string;
  name: string;
  column: string;
  link: SearchLink;
  rule: SearchMatchType;
  type: SearchDataType;
  val: string | Array<string>;
  startWith?: string;
  endWith?: string;
}
export interface PublicModel {
  isDelete?: number;
  bsStatus?: string;
  mark?: string;
  createTime?: string;
  createBy?: string;
  updateTime?: string;
  updateBy?: string;
  erpCode?: string;
}
export interface ControlSet {
  controlType: string;
  displayName: string;
  fieldName: string;
  propName: string;
  queryConfig: string;
  requestUrl: string;
  tableAsName: string;
}
export interface InvCountEntity {
  id?: string;
  srcBillId?: string;
  srcId?: string;
  srcBill?: string;
  srcSort?: string;
  srcType?: string;
  tarBillId?: string;
  tarId?: string;
  tarType?: string;
  tenantId?: string;
}
//ExTree组件的接口类型
export interface GroupFormData {
  id?: string;
  name?: string;
  number?: string;
  parent?: any;
}
//Search组件输入框的接口类型
export interface FormState {
  wlNo?: string;
  wlName?: string;
  tableName?: string;
  searchNo?: string;
  searchName?: string;
}
//StockAmountSearch组件输入框的接口类型
export interface StockFormState {
  matName?: string;
  stockName?: string;
  compartmentName?: string;
  locationName?: string;
  matId?: string;
  stockId?: string;
  compartmentId?: string;
  locationId?: string;
  tableName?: string;
}
//搜索表格的初始值
export const tableParams = {
  //配置对应的查询参数
  total: 0,
  currentPage: 1,
  pageSize: 10, //currentPage第几页,pageSize是一页几个,total总数
};
