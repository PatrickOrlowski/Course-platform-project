import { integer, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createdAt, id, updatedAt } from '@/drizzle/schemaHelpers'
import { CourseProductTable } from '@/drizzle/schema/courseProduct'
import { CourseTable } from '@/drizzle/schema/course'
import { CourseSectionTable } from '@/drizzle/schema/courseSection'
import { UserLessonCompleteTable } from '@/drizzle/schema/userLessonComplete'

export const lessonStatuses = ['public', 'private', 'preview'] as const
export type LessonStatus = (typeof lessonStatuses)[number]
export const lessonStatusEnum = pgEnum('lesson_status', lessonStatuses)

export const LessonTable = pgTable('lessons', {
    id,
    name: text().notNull(),
    description: text(),
    youtubeVideoId: text().notNull(),
    order: integer().notNull(),
    status: lessonStatusEnum().notNull().default('private'),
    sectionId: uuid()
        .notNull()
        .references(() => CourseTable.id, { onDelete: 'cascade' }),
    createdAt,
    updateAt: updatedAt,
})

export const LessonRelationship = relations(LessonTable, ({ one, many }) => ({
    section: one(CourseSectionTable, {
        fields: [LessonTable.sectionId],
        references: [CourseSectionTable.id],
    }),
    userLessonsComplete: many(UserLessonCompleteTable),
}))
