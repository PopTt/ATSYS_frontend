export var EventType;
(function (EventType) {
  EventType[(EventType['Lecture Class'] = 0)] = 'Lecture Class';
  EventType[(EventType['Tutorial Class'] = 1)] = 'Tutorial Class';
  EventType[(EventType['Normal Class'] = 2)] = 'Normal Class';
})(EventType || (EventType = {}));

export class Event {
  constructor(
    event_id,
    event_name,
    event_description,
    event_type,
    established_time,
    start_date,
    end_date,
    admin_id
  ) {
    this.event_id = event_id;
    this.event_name = event_name;
    this.event_description = event_description;
    this.event_type = event_type;
    this.established_time = established_time;
    this.start_date = start_date;
    this.end_date = end_date;
    this.admin_id = admin_id;
  }

  getId() {
    return this.event_id;
  }

  getEventName() {
    return this.event_name;
  }

  getEventDescription() {
    return this.event_description;
  }

  getEventType() {
    return EventType[this.event_type];
  }

  getCreatedDate() {
    return this.established_time;
  }

  getStartDate() {
    if (this.start_date === null) return 'N/A';
    return new Date(this.start_date).toLocaleDateString().split('T')[0];
  }

  getEndDate() {
    if (this.end_date === null) return 'N/A';
    return new Date(this.end_date).toLocaleDateString().split('T')[0];
  }

  getStatus() {
    let today = new Date();
    if (this.start_date === null || this.end_date === null) return false;
    return today > new Date(this.start_date) && today < new Date(this.end_date);
  }
}
