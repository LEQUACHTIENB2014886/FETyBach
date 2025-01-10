const setRoutes = (route, list) => {
  list.filter((item) => {
    if (item.path === route.path) {
      route.component = item.component;
      route.meta = item.meta;
      route.name = item.name;
      if (route.children && route.children.length) {
        let children = [];
        route.children.filter((option) => {
          children.push(setRoutes(option, item.children));
        });
        route.children = children;
      }
    }
  });
  return route;
};

function hasPermission(permissions, route) {
  if (route.meta && route.meta.permissions) {
    return permissions.some((role) => route.meta.permissions.includes(role.toLowerCase()));
  } else {
    return true;
  }
}

export function filterAsyncRoutes(routes, permissions) {
  const finallyRoutes = [];
  routes.forEach((route) => {
    const item = { ...route };
    if (hasPermission(permissions, item)) {
      if (item.children) {
        item.children = filterAsyncRoutes(item.children, permissions);
      }
      finallyRoutes.push(item);
    }
  });
  return finallyRoutes;
}
