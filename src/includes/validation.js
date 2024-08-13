import {
  Form as VeeForm,
  Field as VeeField,
  defineRule, ErrorMessage, configure
} from 'vee-validate';
import {
  required, min, max, alpha_spaces, email,
  min_value as minVal, max_value as maxVal, confirmed, not_one_of as excluded,
} from '@vee-validate/rules';
import {
  transRequiredField,
  transMinField,
  transMaxField
} from '@/helper/transform.language';


export const VeeValidatePlugin = {
  install(app) {

    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);
    defineRule('required', required);
    defineRule('tos', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alpha_spaces);
    defineRule('email', email);
    defineRule('min_value', minVal);
    defineRule('max_value', maxVal);
    defineRule('passwords_mismatch', confirmed);
    defineRule('excluded', excluded);
    defineRule('contry_excluded', excluded);
    configure({ /*configure 是一個可以用來設置vee-validate預設行為的方法，在這裡我們要用來修改錯誤訊息*/
      generateMessage: (context) => { /*generateMessage這功能可以補捉到當前端驗證失敗時所接收到的相關訊息，
      也就是當為validator為false時，它會藉由constext這個引數來接收當前validator false回傳的欄位相關訊息
      以這專案為例，當ErrorMessage裡的訊息被觸發時，它會回傳該它所對應欄位的相關資訊，如下所示context.field就是schema裡所定義的key
      */

        const messages = {
          required: transRequiredField(context.field),
          min: transMinField(context.field),
          max: transMaxField(context.field),
          alpha_spaces: `The field ${context.field} may only contain alphabetic characters and spaces.`,
          email: `請使用有效的${context.field}格式`,
          min_value: `The field ${context.field} is too low.`,
          max_value: `The field ${context.field} is too high.`,
          excluded: `You are not allowed to use this value for the field ${context.field}.`,
          contry_excluded: `Due to restrictions, we do not accept users from this laction`,
          passwords_mismatch: `與所輸入的密碼不符合`,
          tos: `You must accept the Terms of Service.`,
        }
        const message = messages[context.rule.name] ? messages[context.rule.name] : `The field ${context.field} is invalid.`
        return message
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true
    })
  },
};
