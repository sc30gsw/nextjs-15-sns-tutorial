import { TextField } from '@/components/ui'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { IconBell, IconLogin, IconMail, IconSearch } from 'justd-icons'
import Link from 'next/link'

export const AppHeader = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md px-4 md:px-6 py-3 flex items-center justify-between fixed w-full z-50">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <IconLogin className="h-6 w-6 text-primary" />
        <span className="text-lg font-bold text-primary">Next SNS</span>
      </Link>
      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-md">
          <TextField
            type="text"
            placeholder="Search..."
            className="pr-10 rounded-full"
          />
          <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="relative" prefetch={false}>
            <IconBell className="h-6 w-6 text-muted-foreground" />
          </Link>
          <Link href="#" className="relative" prefetch={false}>
            <IconMail className="h-6 w-6 text-muted-foreground" />
          </Link>

          <div>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Link href={'/sign-in'} className="relative" prefetch={false}>
                <IconLogin className="h-6 w-6 text-muted-foreground" />
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  )
}
