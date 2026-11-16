/** 휴대폰 번호를 하이픈 형식으로 바꾼다. 형식을 알 수 없으면 받은 값을 그대로 반환한다. */
export function formatPhoneNumber(phoneNumber: string) {
  const digits = phoneNumber.replace(/\D/g, "");
  const match = /^(01\d)(\d{3,4})(\d{4})$/.exec(digits);

  return match ? match.slice(1).join("-") : phoneNumber;
}
