export function generateTaskUserSubscriptionTopic(userId: string) {
  return `task.user.${userId}`
}

export function generateTaskCountUserSubscriptionTopic(userId: string) {
  return `task.count.${userId}`
}

export function generateSummaryTaskCalendarSubscriptionTopic(userId: string) {
  return `summary.task.calendar.${userId}`
}

export function generateSummaryGroupSubscriptionTopic(userId: string) {
  return `summary.group.${userId}`
}

export class SubscriptionTopicGenerator {
  static userTopic(userId: string) {
    return `user.${userId}`
  }
}
