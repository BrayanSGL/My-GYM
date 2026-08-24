import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { PageTransition } from './PageTransition'

export function AppShell() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-24">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <BottomNav />
    </div>
  )
}
