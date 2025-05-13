import { Route } from "wouter";

// Removed authentication for demo purposes
export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  // Skip authentication check and directly render the component
  return <Route path={path} component={Component} />;
}
