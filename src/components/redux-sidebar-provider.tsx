// components/redux-sidebar-provider.tsx
"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RootState } from "@/store/store"; // Adjust path to your store
import { setSidebarOpen } from "@/store/sidebarSlice"; // Adjust path

export function ReduxSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.sidebar.open);

  return (
    <SidebarProvider
      // Pass the Redux state as the source of truth
      open={open}
      // Dispatch action when the sidebar needs to change state
      onOpenChange={(newOpen) => dispatch(setSidebarOpen(newOpen))}
    >
      {children}
    </SidebarProvider>
  );
}
