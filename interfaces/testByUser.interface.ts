export interface ITestResult {
    name: string;
    title: string;
    grade: number;
}

export interface ITestByUserQuery {
    testId?: string;
    userId?: string;
}

export interface ITestUserless {
    testId: string;
    grade: number;
}

export interface ITestByUser extends ITestUserless {
    userId: string;
}
