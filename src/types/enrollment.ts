export type EnrollmentType = {
    id:number;
    is_accepted: boolean;
    is_rejected: boolean;
    is_archived: boolean;
    enrollment_detail: EnrollmentDetailType;
    enrolment_questions: EnrolmentQuestionType[];
}
export type EnrollmentDetailType = {
    id:number;
    full_name_en:string;
    full_name_kh:string;
    gender:boolean;
    date_of_birth: string;
    current_address:string;
    grade_level:string;
    phone_number:string;
}

export type EnrolmentQuestionType = {
    id:number;
    question:string;
    answer:string;
}