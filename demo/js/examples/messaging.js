export const messagingApprovalNewDevice = `
<!-- Ported from Slack Block Kit Builder template -->
<Blocks>
  <Section>
    You have a new request:<br />
    <b>
      <a href="fakeLink.toEmployeeProfile.com">Fred Enriquez - New device request</a>
    </b>
  </Section>
  <Section>
    <Field>
      <b>Type:</b><br />
      Computer (laptop)
    </Field>
    <Field>
      <b>When:</b><br />
      Submitted Aut 10
    </Field>
    <Field>
      <b>Last Update:</b><br />
      Mar 10, 2015 (3 years, 5 months)
    </Field>
    <Field>
      <b>Reason:</b><br />
      All vowel keys aren't working.
    </Field>
    <Field>
      <b>Specs:</b><br />
      "Cheetah Pro 15" - Fast, really fast"
    </Field>
  </Section>
  <Actions>
    <Button value="click_me_123" style="primary">Approve</Button>
    <Button value="click_me_123" style="danger">Deny</Button>
  </Actions>
</Blocks>
`.trim()

export const messagingApprovalTimeOff = `
<!-- Ported from Slack Block Kit Builder template -->
<Blocks>
  <Section>
    You have a new request:<br />
    <b>
      <a href="google.com">Fred Enriquez - Time Off request</a>
    </b>
  </Section>
  <Section>
    <img src="https://api.slack.com/img/blocks/bkb_template_images/approvalsNewDevice.png" alt="computer thumbnail" />
    <b>Type:</b><br />
    Paid time off<br />
    <b>When:</b><br />
    Aug 10-Aug 13<br />
    <b>Hours:</b> 16.0 (2 days)<br />
    <b>Remaining balance:</b> 32.0 hours (4 days)<br />
    <b>Comments:</b> "Family in town, going camping!"
  </Section>
  <Actions>
    <Button value="click_me_123" style="primary">Approve</Button>
    <Button value="click_me_123" style="danger">Deny</Button>
  </Actions>
</Blocks>
`.trim()

export const messagingNotification = `
<!-- Ported from Slack Block Kit Builder template -->
<Blocks>
  <Section>
    Looks like you have a scheduling conflict with this event:
  </Section>
  <Divider />
  <Section>
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/notifications.png" alt="calendar thumbnail" />
    <b>
      <a href="fakeLink.toUserProfiles.com">Iris / Zelda 1-1</a>
    </b>
    <br />
    Tuesday, January 21 4:00-4:30pm<br />
    Building 2 - Havarti Cheese (3)<br />
    2 guests
  </Section>
  <Context>
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/notificationsWarningIcon.png" alt="notifications warning icon" />
    <b>Conflicts with Team Huddle: 4:15-4:30pm</b>
  </Context>
  <Divider />
  <Section>
    <b>Propose a new time:</b>
  </Section>
  <Section>
    <b>Today - 4:30-5pm</b><br />
    Everyone is available: @iris, @zelda
    <Button value="click_me_123">Choose</Button>
  </Section>
  <Section>
    <b>Tomorrow - 4-4:30pm</b><br />
    Everyone is available: @iris, @zelda
    <Button value="click_me_123">Choose</Button>
  </Section>
  <Section>
    <b>Tomorrow - 6-6:30pm</b><br />
    Some people aren't available: @iris, <s>@zelda</s>
    <Button value="click_me_123">Choose</Button>
  </Section>
  <Section>
    <b>
      <a href="fakeLink.toMoreTimes.com">Show more times</a>
    </b>
  </Section>
</Blocks>
`.trim()

export const messagingOnboardingTaskbot = `
<!-- Ported from Slack Block Kit Builder template -->
<Blocks>
  <Section>
    Hey there 👋 I'm TaskBot.
    I'm here to help you create and manage tasks in Slack.<br />
    There are two ways to quickly create tasks:
  </Section>
  <Section>
    <b>1️⃣ Use the <code>/task</code> command</b>. Type <code>/task</code> followed by a short description of your tasks and I'll ask for a due date (if applicable).
    Try it out by using the <code>/task</code> command in this channel.
  </Section>
  <Section>
    <b>2️⃣ Use the <i>Create a Task</i> action.</b> If you want to create a task from a message, select <code>Create a Task</code> in a message's context menu.
    Try it out by selecting the <i>Create a Task</i> action for this message (shown below).
  </Section>
  <Image src="https://api.slack.com/img/blocks/bkb_template_images/onboardingComplex.jpg" alt="image1" title="image1" />
  <Section>
    ➕ To start tracking your team's tasks, <b>add me to a channel</b> and I'll introduce myself.
    I'm usually added to a team or project channel. Type <code>/invite @TaskBot</code> from the channel or pick a channel on the right.
    <ConversationsSelect placeholder="Select a channel..." />
  </Section>
  <Divider />
  <Context>
    👀 View all tasks with <code>/task list</code><br />
    ❓Get help at any time with <code>/task help</code> or type <b>help</b> in a DM with me
  </Context>
</Blocks>
`.trim()

export const messagingOnboardingApp = `
<!-- Ported from Slack Block Kit Builder template -->
<Blocks>
  <Section>
    Hi David :wave:
  </Section>
  <Section>
    Great to see you here! App helps you to stay up-to-date with your meetings and events right here within Slack. These are just a few things which you will be able to do:
  </Section>
  <Section>
    <ul>
      <li>Schedule meetings</li>
      <li>Manage and update attendees</li>
      <li>Get notified about changes of your meetings</li>
    </ul>
  </Section>
  <Section>
    But before you can do all these amazing things, we need you to connect your calendar to App. Simply click the button below:
  </Section>
  <Actions>
    <Button value="click_me_123">Connect account</Button>
  </Actions>
</Blocks>
`.trim()

export const messagingPoll = `
<!-- Ported from Slack Block Kit Builder template -->
<Blocks>
  <Section>
    <b>Where should we order lunch from?</b> Poll by <a href="fakeLink.toUser.com">Mark</a>
  </Section>
  <Divider />
  <Section>
    :sushi: <b>Ace Wasabi Rock-n-Roll Sushi Bar</b><br />
    The best landlocked sushi restaurant.
    <Button value="click_me_123">Vote</Button>
  </Section>
  <Context>
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/profile_1.png" alt="Michael Scott" />
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/profile_2.png" alt="Dwight Schrute" />
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/profile_3.png" alt="Pam Beasely" />
    3 votes
  </Context>
  <Section>
    :hamburger: <b>Super Hungryman Hamburgers</b><br />
    Only for the hungriest of the hungry.
    <Button value="click_me_123">Vote</Button>
  </Section>
  <Context>
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/profile_4.png" alt="Angela" />
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/profile_2.png" alt="Dwight Schrute" />
    2 votes
  </Context>
  <Section>
    :ramen: <b>Kagawa-Ya Udon Noodle Shop</b><br />
    Do you like to shop for noodles? We have noodles.
    <Button value="click_me_123">Vote</Button>
  </Section>
  <Context>
    No votes
  </Context>
  <Divider />
  <Actions>
    <Button value="click_me_123">Add a suggestion</Button>
  </Actions>
</Blocks>
`.trim()

export const messagingSearchResultsTripAgent = `
<!-- Ported from Slack Block Kit Builder template -->
<Blocks>
  <Section>
    We found <b>205 Hotels</b> in New Orleans, LA from <b>12/14 to 12/17</b>
    <Overflow>
      <OverflowItem value="value-0">Option One</OverflowItem>
      <OverflowItem value="value-1">Option Two</OverflowItem>
      <OverflowItem value="value-2">Option Three</OverflowItem>
      <OverflowItem value="value-3">Option Four</OverflowItem>
    </Overflow>
  </Section>
  <Divider />
  <Section>
    <b>
      <a href="fakeLink.toHotelPage.com">Windsor Court Hotel</a>
    </b>
    <br />
    ★★★★★<br />
    $340 per night<br />
    Rated: 9.4 - Excellent
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/tripAgent_1.png" alt="Windsor Court Hotel thumbnail" />
  </Section>
  <Context>
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/tripAgentLocationMarker.png" alt="Location Pin Icon" />
    Location: Central Business District
  </Context>
  <Divider />
  <Section>
    <b>
      <a href="fakeLink.toHotelPage.com">The Ritz-Carlton New Orleans</a>
    </b>
    <br />
    ★★★★★<br />
    $340 per night<br />
    Rated: 9.1 - Excellent
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/tripAgent_2.png" alt="The Ritz-Carlton New Orleans thumbnail" />
  </Section>
  <Context>
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/tripAgentLocationMarker.png" alt="Location Pin Icon" />
    Location: French Quarter
  </Context>
  <Divider />
  <Section>
    <b>
      <a href="fakeLink.toHotelPage.com">Omni Royal Orleans Hotel</a>
    </b>
    <br />
    ★★★★★<br />
    $419 per night<br />
    Rated: 8.8 - Excellent
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/tripAgent_3.png" alt="Omni Royal Orleans Hotel thumbnail" />
  </Section>
  <Context>
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/tripAgentLocationMarker.png" alt="Location Pin Icon" />
    Location: French Quarter
  </Context>
  <Divider />
  <Actions>
    <Button value="click_me_123">Next 2 Results</Button>
  </Actions>
</Blocks>
`.trim()

export const messagingSearchResultsFileCard = `
<!-- Ported from Slack Block Kit Builder template -->
<Blocks>
  <Section>
    :mag: Search results for <b>Cata</b>
  </Section>
  <Divider />
  <Section>
    <b>
      <a href="fakeLink.toYourApp.com">Use Case Catalogue</a>
    </b>
    <br />
    Use Case Catalogue for the following departments/roles...
    <Select placeholder="Manage">
      <Option value="value-0">Edit it</Option>
      <Option value="value-1">Read it</Option>
      <Option value="value-2">Save it</Option>
    </Select>
  </Section>
  <Section>
    <b>
      <a href="fakeLink.toYourApp.com">Customer Support - Workflow Diagram Catalogue</a>
    </b>
    <br />
    This resource was put together by members of...
    <Select placeholder="Manage">
      <Option value="value-0">Manage it</Option>
      <Option value="value-1">Read it</Option>
      <Option value="value-2">Save it</Option>
    </Select>
  </Section>
  <Section>
    <b>
      <a href="fakeLink.toYourApp.com">Self-Serve Learning Options Catalogue</a>
    </b>
    <br />
    See the learning and development options we...
    <Select placeholder="Manage">
      <Option value="value-0">Manage it</Option>
      <Option value="value-1">Read it</Option>
      <Option value="value-2">Save it</Option>
    </Select>
  </Section>
  <Section>
    <b>
      <a href="fakeLink.toYourApp.com">Use Case Catalogue - CF Presentation - [June 12, 2018]</a>
    </b>
    <br />
    This is presentation will continue to be updated as...
    <Select placeholder="Manage">
      <Option value="value-0">Manage it</Option>
      <Option value="value-1">Read it</Option>
      <Option value="value-2">Save it</Option>
    </Select>
  </Section>
  <Section>
    <b>
      <a href="fakeLink.toYourApp.com">Comprehensive Benefits Catalogue - 2019</a>
    </b>
    <br />
    Information about all the benfits we offer is...
    <Select placeholder="Manage">
      <Option value="value-0">Manage it</Option>
      <Option value="value-1">Read it</Option>
      <Option value="value-2">Save it</Option>
    </Select>
  </Section>
  <Divider />
  <Actions>
    <Button value="click_me_123">Next 5 Results</Button>
  </Actions>
</Blocks>
`.trim()

export const messagingNewsletter = `
<!-- Ported from Slack Block Kit Builder template -->
<Blocks>
  <Header>
    :newspaper:&nbsp;&nbsp;Paper Company Newsletter&nbsp;&nbsp;:newspaper:
  </Header>
  <Context>
    <b>November 12, 2019</b>&nbsp;&nbsp;|&nbsp;&nbsp;Sales Team Announcements
  </Context>
  <Divider />
  <Section>
    :loud_sound: <b>IN CASE YOU MISSED IT</b> :loud_sound:
  </Section>
  <Section>
    Replay our screening of <b>Threat Level Midnight</b> and pick up a copy of the DVD to give to your customers at the front desk.
    <Button>Watch Now</Button>
  </Section>
  <Section>
    The <b>2019 Dundies</b> happened.<br />
    Awards were given, heroes were recognized.<br />
    Check out <b>#dundies-2019</b> to see who won awards.
  </Section>
  <Divider />
  <Section>
    :calendar: |&nbsp;&nbsp;&nbsp;<b>UPCOMING EVENTS</b>&nbsp;&nbsp;| :calendar:
  </Section>
  <Section>
    <code>11/20-11/22</code> <b>Beet the Competition</b> <i>annual retreat at Schrute Farms</i>
    <Button>RSVP</Button>
  </Section>
  <Section>
    <code>12/01</code> <b>Toby's Going Away Party</b> at <i>Benihana</i>
    <Button>Learn More</Button>
  </Section>
  <Section>
    <code>11/13</code> :pretzel: <b>Pretzel Day</b> :pretzel: at <i>Scranton Office</i>
    <Button>RSVP</Button>
  </Section>
  <Divider />
  <Section>
    :calendar: |&nbsp;&nbsp;&nbsp;<b>PAST EVENTS</b>&nbsp;&nbsp;| :calendar:
  </Section>
  <Section>
    <code>10/21</code> <b>Conference Room Meeting</b>
    <Button>Watch Recording</Button>
  </Section>
  <Divider />
  <Section>
    <b>FOR YOUR INFORMATION</b>
  </Section>
  <Section>
    :printer: <b>Sabre Printers</b> are no longer catching on fire! The newest version of our printers are safe to use. Make sure to tell your customers today.
  </Section>
  <Divider />
  <Section>
    Please join me in welcoming our 3 <b>new hires</b> to the Paper Company family!
    <p><b>Robert California</b>, CEO</p>
    <p><b>Ryan Howard</b>, Temp</p>
    <p><b>Erin Hannon</b>, Receptionist</p>
  </Section>
  <Divider />
  <Context>
    :pushpin: Do you have something to include in the newsletter? Here's <b>how to submit content</b>.
  </Context>
</Blocks>
`.trim()
