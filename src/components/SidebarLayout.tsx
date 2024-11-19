'use client';

import { Toaster } from '@/components/toaster';
import { usePathname } from 'next/navigation';

import { AppSidebar } from '@/components/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/breadcrumb';
import { Separator } from '@/components/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/sidebar';

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pathParts = pathname.split('/').filter(Boolean);

  const isConsultorio = pathname.startsWith('/consultorio');

  const capitalizeFirstLetter = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

  const mainItem = pathParts[0] ? capitalizeFirstLetter(pathParts[0]) : 'Home';
  const subItem = pathParts[1] ? capitalizeFirstLetter(pathParts[1]) : '';

  return (
    <>
      {!isConsultorio ? (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">{mainItem}</BreadcrumbLink>
                    </BreadcrumbItem>
                    {subItem && (
                      <>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                          <BreadcrumbPage>{subItem}</BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <main>{children}</main>
              <Toaster />
            </div>
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <main>{children}</main>
        </div>
      )}
    </>
  );
}
