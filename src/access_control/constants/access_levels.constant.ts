export const access_control = {
  seeAllPermissions: {
    uuid: 'f5351386-3d31-42fa-862e-5f1f7494452d',
    title: 'See All Permissions',
    action: 'see-all-permissions',
  },
  seeAllRoles: {
    uuid: '286433b1-b2da-4e2f-86d4-6ec31a3ea99e',
    title: 'See All Roles',
    action: 'see-all-roles',
  },
  seeAllBusinessRoles: {
    uuid: 'a5a9b327-a888-4f9d-8b24-9b428590d146',
    title: 'See All Business Roles',
    action: 'see-all-business-roles',
  },
  updateSystemRole: {
    uuid: 'c4f90d3e-7570-41c0-abe5-471a8be9dd52',
    title: 'Update System Role',
    action: 'update-system-role',
  },
  createBusinessRole: {
    uuid: '9651b985-6066-4acc-810b-f965789523da',
    title: 'Update Business Role',
    action: 'create-business-role',
  },
  updateBusinessRole: {
    uuid: '991163a9-c930-4e54-8e38-49b6884d93aa',
    title: 'Update Business Role',
    action: 'update-business-role',
  },
  removeBusinessRole: {
    uuid: '64fb8645-8a37-46b7-ab9d-f099e06c6756',
    title: 'Remove Business Roles',
    action: 'remove-business-roles',
  },
};
export const business_permissions = {
  createBusiness: {
    uuid: '3cd1e431-2e4b-4150-aa0c-d01d9e16fbd0',
    title: 'Create Business',
    action: 'create-business',
  },
  updateBusinessInfo: {
    uuid: '6ccd3769-75e3-4a4e-8abb-a03a7121df90',
    title: 'Update Business Info',
    action: 'update-business-info',
  },
  removeBusiness: {
    uuid: 'dc2ce74f-eea0-462c-a339-c6c325a8c2ec',
    title: 'Remove Business',
    action: 'remove-business',
  },
  seeAllBusiness: {
    uuid: '9638edcc-617a-4767-bee5-8a4886d58611',
    title: 'See All Business',
    action: 'see-all-business',
  },
  addUserToBusiness: {
    uuid: '49c328f1-0d47-483f-b646-f52cf30599eb',
    title: 'Add User to Business',
    action: 'add-user-to-business',
  },
  removeUserFromBusiness: {
    uuid: 'c6419246-e9eb-44bf-b140-717916182822',
    title: 'Remove User from Business',
    action: 'remove-user-from-business',
  },
};
export const product_permissions = {
  readProducts: {
    uuid: 'f7c3fd2b-515d-4e9f-b400-89b1db8cd1e8',
    title: 'Read products',
    action: 'read-products',
  },
  createProduct: {
    uuid: 'fe81d8f7-9b4c-45de-b489-e0a515a6a801',
    title: 'Create new product',
    action: 'create-product',
  },
  updateProduct: {
    uuid: '0bd70c1c-605c-4702-9122-7d17923f902c',
    title: 'Update product',
    action: 'update-product',
  },
  deleteProduct: {
    uuid: '5700489a-c7d6-4cfc-882e-7e5066bb817d',
    title: 'Delete product',
    action: 'delete-product',
  },
};
export const category_permissions = {
  createCategory: {
    uuid: 'fceed642-bf28-4cea-9cb6-39040748a031',
    title: 'Create new category',
    action: 'create-category',
  },
  updateCategory: {
    uuid: '702e0d99-7697-4602-ac64-0e2d705e465a',
    title: 'Update category',
    action: 'update-category',
  },
  deleteCategory: {
    uuid: '4d4d49f0-2439-44d9-9c05-4004a047062b',
    title: 'Delete category',
    action: 'delete-category',
  },
};

export const administratorAccessPermissions = [
  access_control.seeAllRoles,
  access_control.updateSystemRole,
  business_permissions.createBusiness,
  business_permissions.removeBusiness,
  business_permissions.seeAllBusiness,
];
