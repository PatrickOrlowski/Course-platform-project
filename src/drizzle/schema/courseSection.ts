import { integer, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createdAt, id, updatedAt } from '@/drizzle/schemaHelpers'
import { CourseProductTable } from '@/drizzle/schema/courseProduct'
import { CourseTable } from '@/drizzle/schema/course'
import { LessonTable } from '@/drizzle/schema/lesson'

export const courseSelectionStatuses = ['public', 'private'] as const
export type CourseSelectionStatus = (typeof courseSelectionStatuses)[number]
export const courseSectionStatusEnum = pgEnum(
    'course_section_status',
    courseSelectionStatuses
)

export const CourseSectionTable = pgTable('course_sections', {
    id,
    name: text().notNull(),
    status: courseSectionStatusEnum().notNull().default('private'),
    order: integer().notNull(),
    courseId: uuid()
        .notNull()
        .references(() => CourseTable.id, { onDelete: 'cascade' }),
    createdAt,
    updateAt: updatedAt,
})

export const CourseSectionRelationship = relations(
    CourseSectionTable,
    ({ one, many }) => ({
        course: one(CourseTable, {
            fields: [CourseSectionTable.courseId],
            references: [CourseTable.id],
        }),
        lessons: many(LessonTable),
    })
)
