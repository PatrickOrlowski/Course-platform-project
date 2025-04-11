import { currentUser } from '@clerk/nextjs/server'
import { insertUser } from '@/features/users/db/users'
import { syncClerkUserMetadata } from '@/services/clerk'
import { UserRole } from '@/drizzle/schema/user'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const user = await currentUser()

    if (!user) {
        return new Response('User not found', { status: 500 })
    }

    if (!user.fullName) {
        return new Response('User name missing', { status: 500 })
    }

    if (!user.primaryEmailAddress?.emailAddress) {
        return new Response('User email missing', { status: 500 })
    }

    const dbUser = await insertUser({
        clerkUserId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        name: user.fullName,
        imageUrl: user.imageUrl,
        role: (user?.publicMetadata?.role as UserRole) ?? 'user',
    })

    if (!dbUser) {
        return new Response('Failed to insert user', { status: 500 })
    }

    await syncClerkUserMetadata({
        id: dbUser.id,
        clerkUserId: user.id,
        role: dbUser.role,
    })

    await new Promise((resolve) => setTimeout(resolve, 100))

    return NextResponse.redirect(request.headers.get("referer") ?? '/')
}
