// Globals provided by the React UMD scripts loaded before the bundle.
declare const React: typeof import("react");
const createElement = React.createElement as (type: unknown, props: Record<string, unknown>) => unknown;
export const jsx = (type: unknown, props: Record<string, unknown>, key?: unknown) =>
  createElement(type, key === undefined ? props : { ...props, key });
export const jsxs = jsx;
export const Fragment = React.Fragment;
