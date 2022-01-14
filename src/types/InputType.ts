export interface Input{
    Module:string,
    Job: string,
    Input:HomeTaxInputType
}
export interface HomeTaxInputType{
    userName: string,
    phoneNum:string,
    ssn1:string,
    ssn2:string
}