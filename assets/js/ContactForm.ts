import { html, LitElement } from 'lit';
import { property, query, state, customElement } from 'lit/decorators.js';
import LiveState, { liveState, liveStateConfig } from 'phx-live-state';

type Contact = {
  name: string;
  email: string;
  message: string;
}

@customElement("contact-form")
@liveState({
  properties: ['url'],
  events: {
    send: ['send_contact_form'],
    receive: ['message-sent', 'message-resent']
  }
})
export class ContactForm extends LitElement {
  @liveStateConfig('url')
  @property()
  url: string;

  @liveStateConfig('topic')
  topic: string = `contact:${window.location.hostname}`
  
  @state()
  contact: Contact;

  liveState: LiveState;

  @query('input[name="name"]')
  name: HTMLInputElement | undefined;

  @query('input[name="email"]')
  email: HTMLInputElement | undefined;

  @query('textarea[name="message"]')
  message: HTMLTextAreaElement | undefined;

  @property()
  sent: boolean = false;

  constructor() {
    super();
    this.addEventListener("message-sent", (e) => {
      this.sent = true
    })
    this.addEventListener("message-resent", (e: CustomEvent) => {
      alert(e.detail.message)
    })
  }

  sendContactForm(e: Event) {
    this.contact = {
      name: this.name?.value,
      email: this.email?.value,
      message: this.message?.value
    }
    this.dispatchEvent(new CustomEvent('send_contact_form', {
      detail: this.contact
    }));
    e.preventDefault();
  }

  render() {
    let template;
    if (this.sent) {
      template = html`<p>Contact form sent successfully</p>`;
    } else {
      template = html`
        <form @submit=${this.sendContactForm}>
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>

          <label for="email">Email:</label>
          <input type="email" id="email" name="email" required>

          <label for="message">Message:</label>
          <textarea id="message" name="message" required></textarea>

          <button type="submit">Submit</button>
        </form>
      `;
    }
    return html`<div>${template}</div>`
  }
}
