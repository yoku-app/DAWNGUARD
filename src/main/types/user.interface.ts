export interface UserOnboardingCompletion {
    respondent?: Date;
    creator?: Date;
}

export interface UserProfile {
    id: number;
    userId: string;
    email: string;
    displayName: string;
    avatarURL?: string;
    createdAt: string;
    updatedAt?: Date;
    dob?: Date;
    onboardingCompletion: UserOnboardingCompletion;
}
