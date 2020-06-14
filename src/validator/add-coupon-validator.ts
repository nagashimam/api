import * as Joi from "@hapi/joi";

export default class AddCouponValidator {
  public validateAddCouponRequest(createdBy: string, title: string): string {
    const schema = Joi.object({
      createdBy: this.generateSchemaObjectFor("createdBy"),
      title: this.generateSchemaObjectFor("title"),
    });
    const result = schema.validate({ createdBy: createdBy, title: title });
    return result.error ? result.error.message : "";
  }

  private generateSchemaObjectFor(propertyName: string): any {
    return Joi.string()
      .required()
      .max(64)
      .messages({
        //TypeScriptで引数の型付けをしているので、string型ではない = undefined または null
        "string.base": `${propertyName}は必須項目です`,
        "any.required": `${propertyName}は必須項目です`,
        "string.empty": `${propertyName}は必須項目です`,
        "string.max": `${propertyName}は64文字以下で入力してください`,
      });
  }
}
