import type * as React from 'react'

import { Menu, Sidebar } from '@/components/ui'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import {
  IconCreditCard,
  IconDashboard,
  IconEnvelope,
  IconLogin,
  IconMessage,
  IconPeople,
  IconPersonAdd,
  IconSettings,
} from 'justd-icons'
import Link from 'next/link'

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <Sidebar.Header>
        <Link
          className="flex items-center group-data-[collapsible=dock]:size-10 group-data-[collapsible=dock]:justify-center gap-x-2"
          href="/"
        >
          <IconLogin className="size-5" />
          <strong className="font-medium group-data-[collapsible=dock]:hidden">
            Next SNS
          </strong>
        </Link>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Section>
          <Sidebar.Item isCurrent={true} icon={IconDashboard} href="#">
            Overview
          </Sidebar.Item>
          <Sidebar.Item icon={IconSettings} href="#">
            Settings
          </Sidebar.Item>
          <Sidebar.Item icon={IconCreditCard} href="#">
            Billing
          </Sidebar.Item>
          <Sidebar.Item icon={IconEnvelope} href="#" badge="49.67K">
            Newsletter
          </Sidebar.Item>
          <Sidebar.Item icon={IconMessage} href="#" badge={35}>
            Messages
          </Sidebar.Item>
        </Sidebar.Section>
        <Sidebar.Section collapsible={true} title="Team">
          <Sidebar.Item icon={IconPeople} href="#">
            Team Overview
          </Sidebar.Item>
          <Sidebar.Item icon={IconPersonAdd} href="#">
            Add New Member
          </Sidebar.Item>
          <Sidebar.Item href="#">Manage Roles</Sidebar.Item>
        </Sidebar.Section>
      </Sidebar.Content>
      <Sidebar.Footer className="lg:flex lg:flex-row hidden items-center">
        <SignedIn>
          <Menu>
            <div className="flex items-center w-full py-2 gap-4">
              <UserButton />
              <span className="group-data-[collapsible=dock]:hidden flex items-center justify-center">
                John Doe
              </span>
            </div>
          </Menu>
        </SignedIn>
        <SignedOut>
          <Link
            href={'/sign-in'}
            className="flex items-center py-2 gap-2"
            prefetch={false}
          >
            <IconLogin className="h-6 w-6 text-muted-foreground" />
            <span className="group-data-[collapsible=dock]:hidden flex items-center justify-center">
              Log In
            </span>
          </Link>
        </SignedOut>
      </Sidebar.Footer>
      <Sidebar.Rail />
    </Sidebar>
  )
}
