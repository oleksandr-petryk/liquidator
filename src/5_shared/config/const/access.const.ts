export enum ACCESS_DEFAULT_LIST_OF_PERMISSIONS {
  'invite-member' = 'invite-member',
  'delete-member' = 'delete-member',
  'update-member' = 'update-member',
  'add-admin' = 'add-admin',
  'delete-admin' = 'delete-admin',
  'update-admin' = 'update-admin',
  'update-org-name' = 'update-org-name',
  'update-org-slug' = 'update-org-slug',
  'update-org-picture' = 'update-org-picture',
  'add-org-role' = 'add-org-role',
  'delete-org-role' = 'delete-org-role',
  'update-org-role' = 'update-org-role',
  'add-org-permission' = 'add-org-permission',
  'delete-org-permission' = 'delete-org-permission',
  'update-org-permission' = 'update-org-permission',
}

export enum ACCESS_DEFAULT_LIST_OF_ROLES {
  'owner' = 'owner',
  'admin' = 'admin',
  'member' = 'member',
}

export const ACCESS_DEFAULT_ROLE_TO_PERMISSION_RELATION = {
  [ACCESS_DEFAULT_LIST_OF_ROLES.owner]: [
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['invite-member'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['delete-member'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['update-member'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['add-admin'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['delete-admin'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['update-admin'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['update-org-name'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['update-org-slug'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['update-org-picture'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['add-org-role'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['delete-org-role'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['update-org-role'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['add-org-permission'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['delete-org-permission'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['update-org-permission'],
  ],
  [ACCESS_DEFAULT_LIST_OF_ROLES.admin]: [
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['invite-member'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['delete-member'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['update-member'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['add-org-role'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['delete-org-role'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['update-org-role'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['add-org-permission'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['delete-org-permission'],
    ACCESS_DEFAULT_LIST_OF_PERMISSIONS['update-org-permission'],
  ],
  [ACCESS_DEFAULT_LIST_OF_ROLES.member]: [],
} satisfies Record<
  keyof typeof ACCESS_DEFAULT_LIST_OF_ROLES,
  Array<keyof typeof ACCESS_DEFAULT_LIST_OF_PERMISSIONS>
>;
