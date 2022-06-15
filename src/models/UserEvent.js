export class UserEvent {
  constructor(ue_id, event_id, user_id, join_time) {
    this.ue_id = ue_id;
    this.user_id = user_id;
    this.event_id = event_id;
    this.join_time = join_time;
  }

  getId() {
    return this.ue_id;
  }
}
