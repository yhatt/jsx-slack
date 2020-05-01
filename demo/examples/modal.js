export const modalPoll = `
<!-- Ported from Slack Block Kit Builder template -->
<Modal title="Workplace check-in" close="Cancel">
  <Section>
    <p>:wave: Hey David!</p>
    <p>We'd love to hear from you how we can make this place the best place you’ve ever worked.</p>
  </Section>
  <Divider />

  <RadioButtonGroup
    label="You enjoy working here at Pistachio & Co"
    required
  >
    <RadioButton value="1">Strongly agree</RadioButton>
    <RadioButton value="2">Agree</RadioButton>
    <RadioButton value="3">Neither agree nor disagree</RadioButton>
    <RadioButton value="4">Disagree</RadioButton>
    <RadioButton value="5">Strongly disagree</RadioButton>
  </RadioButtonGroup>

  <Select
    label="What do you want for our team weekly lunch?"
    placeholder="Select your favorites"
    multiple
    required
  >
    <Option value="value-0">:pizza: Pizza</Option>
    <Option value="value-1">:fried_shrimp: Thai food</Option>
    <Option value="value-2">:desert_island: Hawaiian</Option>
    <Option value="value-3">:meat_on_bone: Texas BBQ</Option>
    <Option value="value-4">:hamburger: Burger</Option>
    <Option value="value-5">:taco: Tacos</Option>
    <Option value="value-6">:green_salad: Salad</Option>
    <Option value="value-7">:stew: Indian</Option>
  </Select>

  <Textarea
    label="What can we do to improve your experience working here?"
    required
  />
  <Textarea label="Anything else you want to tell us?" />
</Modal>
`.trim()

export const modalSearchResults = `
<!-- Ported from Slack Block Kit Builder template -->
<Modal title="Your accommodation" close="Cancel">
  <Section>
    Please choose an option where you'd like to stay from Oct 21 - Oct 23 (2 nights).
  </Section>
  <Divider />
  <Section>
    <b>Airstream Suite</b><br />
    <b>Share with another person</b>. Private walk-in bathroom. TV. Heating. Kitchen with microwave, basic cooking utensils, wine glasses and silverware.
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/Streamline-Beach.png" alt="Airstream Suite" />
  </Section>
  <Context>
    1x Queen Bed
    <span>|</span>
    $220 / night
  </Context>
  <Actions>
    <Button value="click_me_123">Choose</Button>
    <Button value="click_me_123">View Details</Button>
  </Actions>
  <Divider />
  <Section>
    <b>Redwood Suite</b><br />
    <b>Share with 2 other person</b>. Studio home. Modern bathroom. TV. Heating. Full kitchen. Patio with lounge chairs and campfire style fire pit and grill.
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/redwoodcabin.png" alt="Redwood Suite" />
  </Section>
  <Context>
    1x King Bed
    <span>|</span>
    $350 / night
  </Context>
  <Actions>
    <Button value="click_me_123" style="primary">✓ Your Choice</Button>
    <Button value="click_me_123">View Details</Button>
  </Actions>
  <Divider />
  <Section>
    <b>Luxury Tent</b><br />
    <b>One person only</b>. Shared modern bathrooms and showers in lounge building. Temperature control with heated blankets. Lights and electrical outlets.
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/tent.png" alt="Redwood Suite" />
  </Section>
  <Context>
    1x Queen Bed
    <span>|</span>
    $260 / night
  </Context>
  <Actions>
    <Button value="click_me_123">Choose</Button>
    <Button value="click_me_123">View Details</Button>
  </Actions>
  <Divider />
  <Input type="submit" value="Submit" />
</Modal>
`.trim()

export const modalSettingsAppMenu = `
<!-- Ported from Slack Block Kit Builder template -->
<Modal title="App menu" close="Cancel">
  <Section>
    <b>Hi <a href="fakelink.toUser.com">@David</a>!</b> Here's how I can help you:
  </Section>
  <Divider />
  <Section>
    :calendar: <b>Create event</b><br />
    Create a new event
    <Button value="click_me_123" style="primary">Create event</Button>
  </Section>
  <Section>
    :clipboard: <b>List of events</b><br />
    Choose from different event lists
    <Select placeholder="Choose list">
      <Option value="value-0">My events</Option>
      <Option value="value-1">All events</Option>
      <Option value="value-2">Event invites</Option>
    </Select>
  </Section>
  <Section>
    :gear: <b>Settings</b><br />
    Manage your notifications and team settings
    <Select placeholder="Edit settings">
      <Option value="value-0">Notifications</Option>
      <Option value="value-1">Team settings</Option>
    </Select>
  </Section>
  <Actions>
    <Button value="click_me_123">Send feedback</Button>
    <Button value="click_me_123">FAQs</Button>
  </Actions>
  <Input type="submit" value="Submit" />
</Modal>
`.trim()

export const modalSettingsNotification = `
<!-- Ported from Slack Block Kit Builder template -->
<Modal title="Notification settings" close="Cancel">
  <Section>
    <p>
      <b>
        <a href="fakelink.toUrl.com">PR Strategy 2019</a> posts into <a href="fakelink.toChannel.com">#public-relations</a>
      </b>
    </p>
    <p>Select which notifications to send:</p>
  </Section>
  <Actions>
    <CheckboxGroup>
      <Checkbox value="tasks">
        New tasks
        <small>When new tasks are added to project</small>
      </Checkbox>
      <Checkbox value="comments">
        New comments
        <small>When new comments are added</small>
      </Checkbox>
      <Checkbox value="updates">
        Project updates
        <small>When project is updated</small>
      </Checkbox>
    </CheckboxGroup>
  </Actions>
  <Input type="submit" value="Submit" />
</Modal>
`.trim()

export const modalListOfInformationYourItinerary = `
<!-- Ported from Slack Block Kit Builder template -->
<Modal title="Your itinerary" close="Cancel">
  <Section>:tada: You're all set! This is your booking summary.</Section>
  <Divider />
  <Section>
    <Field>
      <b>Attendee</b><br />
      Katie Chen
    </Field>
    <Field>
      <b>Date</b><br />
      Oct 22-23
    </Field>
  </Section>

  <Context>:house: Accommodation</Context>
  <Divider />
  <Section>
    <b>Redwood Suite</b><br />
    <b>Share with 2 other person</b>. Studio home. Modern bathroom. TV. Heating. Full kitchen. Patio with lounge chairs and campfire style fire pit and grill.
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/redwood-suite.png" alt="Redwood Suite" />
  </Section>

  <Context>:fork_and_knife: Food &amp; Dietary restrictions</Context>
  <Divider />
  <Section>
    <b>All-rounder</b><br />
    You eat most meats, seafood, dairy and vegetables.
  </Section>

  <Context>:woman-running: Activities</Context>
  <Divider />
  <Section>
    <b>Winery tour and tasting</b>
    <Field>Wednesday, Oct 22 2019, 2pm-5pm</Field>
    <Field>Hosted by Sandra Mullens</Field>
  </Section>
  <Section>
    <b>Sunrise hike to Mount Amazing</b>
    <Field>Thursday, Oct 23 2019, 5:30am</Field>
    <Field>Hosted by Jordan Smith</Field>
  </Section>
  <Section>
    <b>Design systems brainstorm</b>
    <Field>Thursday, Oct 23 2019, 11a</Field>
    <Field>Hosted by Mary Lee</Field>
  </Section>

  <Input type="submit" value="Submit" />
</Modal>
`.trim()

export const modalListOfInformationTicketApp = `
<!-- Ported from Slack Block Kit Builder template -->
<Modal title="Ticket app" close="Cancel">
  <Section>
    Pick a ticket list from the dropdown
    <Select placeholder="Select an item">
      <Option value="all_tickets">All Tickets</Option>
      <Option value="assigned_to_me" selected>Assigned To Me</Option>
      <Option value="issued_by_me">Issued By Me</Option>
    </Select>
  </Section>

  <Divider />
  <Context>
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/highpriority.png" alt="High Priority" />
    <b>High Priority</b>
  </Context>
  <Divider />

  <Section>
    <b><a href="fakelink.com">WEB-1098 Adjust borders on homepage graphic</a></b>
    <Overflow>
      <OverflowItem value="done">:white_check_mark: Mark as done</OverflowItem>
      <OverflowItem value="edit">:pencil: Edit</OverflowItem>
      <OverflowItem value="delete">:x: Delete</OverflowItem>
    </Overflow>
  </Section>
  <Context>
    Awaiting Release
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/task-icon.png" alt="Task Icon" /> Task
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/profile_1.png" alt="Michael Scott" /> <a href="fakelink.toUser.com">Michael Scott</a>
  </Context>

  <Section>
    <b><a href="fakelink.com">MOB-2011 Deep-link from web search results to product page</a></b>
    <Overflow>
      <OverflowItem value="done">:white_check_mark: Mark as done</OverflowItem>
      <OverflowItem value="edit">:pencil: Edit</OverflowItem>
      <OverflowItem value="delete">:x: Delete</OverflowItem>
    </Overflow>
  </Section>
  <Context>
    Open
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/newfeature.png" alt="New Feature Icon" /> New Feature
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/profile_2.png" alt="Pam Beasely" /> <a href="fakelink.toUser.com">Pam Beasely</a>
  </Context>

  <Divider />
  <Context>
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/mediumpriority.png" alt="palm tree" />
    <b>Medium Priority</b>
  </Context>
  <Divider />

  <Section>
    <b><a href="fakelink.com">WEB-1098 Adjust borders on homepage graphic</a></b>
    <Overflow>
      <OverflowItem value="done">:white_check_mark: Mark as done</OverflowItem>
      <OverflowItem value="edit">:pencil: Edit</OverflowItem>
      <OverflowItem value="delete">:x: Delete</OverflowItem>
    </Overflow>
  </Section>
  <Context>
    Awaiting Release
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/task-icon.png" alt="Task Icon" /> Task
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/profile_1.png" alt="Michael Scott" /> <a href="fakelink.toUser.com">Michael Scott</a>
  </Context>

  <Section>
    <b><a href="fakelink.com">MOB-2011 Deep-link from web search results to product page</a></b>
    <Overflow>
      <OverflowItem value="done">:white_check_mark: Mark as done</OverflowItem>
      <OverflowItem value="edit">:pencil: Edit</OverflowItem>
      <OverflowItem value="delete">:x: Delete</OverflowItem>
    </Overflow>
  </Section>
  <Context>
    Open
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/newfeature.png" alt="New Feature Icon" /> New Feature
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/profile_2.png" alt="Pam Beasely" /> <a href="fakelink.toUser.com">Pam Beasely</a>
  </Context>

  <Section>
    <b><a href="fakelink.com">WEB-1098 Adjust borders on homepage graphic</a></b>
    <Overflow>
      <OverflowItem value="done">:white_check_mark: Mark as done</OverflowItem>
      <OverflowItem value="edit">:pencil: Edit</OverflowItem>
      <OverflowItem value="delete">:x: Delete</OverflowItem>
    </Overflow>
  </Section>
  <Context>
    Awaiting Release
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/task-icon.png" alt="Task Icon" /> Task
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/profile_1.png" alt="Michael Scott" /> <a href="fakelink.toUser.com">Michael Scott</a>
  </Context>

  <Input type="submit" value="Submit" />
</Modal>
`.trim()
