export class Event {
  constructor(
    event_id,
    event_name,
    event_description,
    established_time,
    invitation_code,
    admin_id
  ) {
    this.event_id = event_id;
    this.event_name = event_name;
    this.event_description = event_description;
    this.established_time = established_time;
    this.invitation_code = invitation_code;
    this.admin_id = admin_id;
  }

  getId() {
    return this.event_id;
  }
}
