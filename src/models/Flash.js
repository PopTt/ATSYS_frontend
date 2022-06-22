export class Flash {
  constructor(flash_id, flash_question, flash_ans, creator_id, attendance_id) {
    this.flash_id = flash_id;
    this.flash_question = flash_question;
    this.flash_ans = flash_ans;
    this.creator_id = creator_id;
    this.attendance_id = attendance_id;
  }

  getId() {
    return this.flash_id;
  }
}
