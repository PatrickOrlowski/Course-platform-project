import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '@/drizzle/schemaHelpers'
import { relations } from 'drizzle-orm'
import { CourseSectionTable } from '@/drizzle/schema/courseSection'
import { LessonTable } from '@/drizzle/schema/lesson'
import { UserCourseAccessTable } from '@/drizzle/schema/userCourseAccess'

export const userRoles = ['user', 'admin'] as const
export type UserRole = (typeof userRoles)[number]
export const userRoleEnum = pgEnum('user_role', userRoles)

export const UserTable = pgTable('users', {
    id,
    clerkUserId: text().notNull().unique(),
    email: text().notNull(),
    name: text().notNull(),
    role: userRoleEnum().notNull().default('user'),
    imageUrl: text(),
    deletedAt: timestamp({ withTimezone: true }),
    createdAt,
    updateAt: updatedAt,
})

export const UserRelationship = relations(UserTable, ({ many }) => ({
    userCourseAccess: many(UserCourseAccessTable),
}))
