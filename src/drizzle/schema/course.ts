import { pgTable, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createdAt, id, updatedAt } from '@/drizzle/schemaHelpers'
import { CourseProductTable } from '@/drizzle/schema/courseProduct'
import { UserCourseAccessTable } from '@/drizzle/schema/userCourseAccess'
import { CourseSectionTable } from '@/drizzle/schema/courseSection'

export const CourseTable = pgTable('courses', {
    id,
    name: text().notNull(),
    description: text().notNull(),
    createdAt,
    updateAt: updatedAt,
})

export const CourseRelationships = relations(CourseTable, ({ many }) => ({
    courseProducts: many(CourseProductTable),
    userCourseAccesses: many(UserCourseAccessTable),
    courseSections: many(CourseSectionTable),
}))
