export const appHomeProjectTracker = `
<!-- Ported from Slack Block Kit Builder template -->
<Home>
  <Section>
    <b>Here's what you can do with Project Tracker:</b>
  </Section>
  <Actions>
    <Button value="create_task" style="primary">Create New Task</Button>
    <Button value="create_project">Create New Project</Button>
    <Button value="help">Help</Button>
  </Actions>
  <Context>
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/placeholder.png" alt="placeholder" />
  </Context>

  <Section>
    <b>Your Configurations</b>
  </Section>
  <Divider />
  <Section>
    <b>#public-relations</b><br />
    <a href="fakelink.toUrl.com">PR Strategy 2019</a> posts new tasks, comments, and project updates to <a href="fakelink.toChannel.com">#public-relations</a>
    <Button value="public-relations">Edit</Button>
  </Section>
  <Divider />
  <Section>
    <b>#team-updates</b><br />
    <a href="fakelink.toUrl.com">Q4 Team Projects</a> posts project updates to <a href="fakelink.toChannel.com">#team-updates</a>
    <Button value="public-relations">Edit</Button>
  </Section>

  <Divider />
  <Actions>
    <Button value="new_configuration">New Configuration</Button>
  </Actions>
</Home>
`.trim()

export const appHomeCalendar = `
<!-- Ported from Slack Block Kit Builder template -->
<Home>
  <Section>
    <b>Today, 22 October</b>
    <Button value="settings">Manage App Settings</Button>
  </Section>
  <Actions>
    <DatePicker placeholder="Select a date" value="2019-10-22" />
  </Actions>
  <Divider />

  <Section>
    <b>
      <a href="fakelink.toUrl.com">Marketing weekly sync</a>
    </b>
    <br />
    11:30am — 12:30pm&nbsp;&nbsp;|&nbsp;&nbsp;SF500 · 7F · Saturn (5)<br />
    Status: ✅ Going
    <Overflow>
      <OverflowItem value="view_event_details">View Event Details</OverflowItem>
      <OverflowItem value="change_response">Change Response</OverflowItem>
    </Overflow>
  </Section>
  <Actions>
    <Button value="join" style="primary">Join Video Call</Button>
  </Actions>
  <Divider />

  <Section>
    <b>
      <a href="fakelink.toUrl.com">Design review w/ Platform leads</a>
    </b>
    <br />
    1:30pm — 2:00pm&nbsp;&nbsp;|&nbsp;&nbsp;SF500 · 4F · Finch (4)
    <Overflow>
      <OverflowItem value="view_event_details">View Event Details</OverflowItem>
      <OverflowItem value="change_response">Change Response</OverflowItem>
    </Overflow>
  </Section>
  <Actions>
    <Select placeholder="Going?">
      <Option value="going">Going</Option>
      <Option value="maybe">Maybe</Option>
      <Option value="decline">Not going</Option>
    </Select>
  </Actions>
  <Divider />

  <Section>
    <b>
      <a href="fakelink.toUrl.com">Presentation write-up</a>
    </b>
    <br />
    4:00pm — 5:30pm&nbsp;&nbsp;|&nbsp;&nbsp;SF500 · 7F · Saturn (5)<br />
    Status: ✅ Going
    <Overflow>
      <OverflowItem value="view_event_details">View Event Details</OverflowItem>
      <OverflowItem value="change_response">Change Response</OverflowItem>
    </Overflow>
  </Section>
  <Actions>
    <Button value="join" style="primary">Join Video Call</Button>
  </Actions>
  <Divider />

  <Context>
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/placeholder.png" alt="placeholder" />
  </Context>
  <Context>
    Past events
  </Context>

  <Section>
    <b>Marketing team breakfast</b><br />
    8:30am — 9:30am&nbsp;&nbsp;|&nbsp;&nbsp;SF500 · 7F · Saturn (5)
  </Section>
  <Divider />
  <Section>
    <b>Coffee chat w/ candidate</b><br />
    10:30am — 11:00am&nbsp;&nbsp;|&nbsp;&nbsp;SF500 · 10F · Cafe
  </Section>
</Home>
`.trim()

export const appHomeExpenseApp = `
<!-- Ported from Slack Block Kit Builder template -->
<Home>
  <Section>
    <b>Budget Performance</b>
    <Button value="app_settings">Manage App Settings</Button>
  </Section>
  <Divider />

  <Section>
    <Field>
      <b>Current Quarter</b><br />
      Budget: $18,000 (ends in 53 days)<br />
      Spend: $4,289.70<br />
      Remain: $13,710.30
    </Field>
    <Field>
      <b>Top Expense Categories</b><br />
      :airplane: Flights · 30%<br />
      :taxi: Taxi / Uber / Lyft · 24%<br />
      :knife_fork_plate: Client lunch / meetings · 18%
    </Field>
  </Section>

  <Context>
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/placeholder.png" alt="placeholder" />
  </Context>
  <Section>
    <b>Expenses Awaiting Your Approval</b>
  </Section>
  <Divider />

  <Context>
    Submitted by
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/profile_3.png" alt="Dwight Schrute" />
    <b>Dwight Schrute</b>
  </Context>
  <Section>
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/creditcard.png" alt="credit card" />
    <b>Team Lunch (Internal)</b><br />
    Cost: <b>$85.50USD</b><br />
    Date: <b>10/16/2019</b><br />
    Service Provider: <b>Honest Sandwiches</b><br />
    Expense no. <b><a href="fakelink.toUrl.com">#1797PD</a></b>
  </Section>
  <Actions>
    <Button value="approve" style="primary">Approve</Button>
    <Button value="decline" style="danger">Decline</Button>
    <Button value="details">View Details</Button>
  </Actions>
  <Divider />

  <Context>
    Submitted by
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/profile_2.png" alt="Pam Beasely" />
    <b>Pam Beasely</b>
  </Context>
  <Section>
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/plane.png" alt="plane" />
    <b>Flights to New York</b><br />
    Cost: <b>$520.78USD</b><br />
    Date: <b>10/18/2019</b><br />
    Service Provider: <b>Delta Airways</b><br />
    Expense no. <b><a href="fakelink.toUrl.com">#1803PD</a></b>
  </Section>
  <Actions>
    <Button value="approve" style="primary">Approve</Button>
    <Button value="decline" style="danger">Decline</Button>
    <Button value="details">View Details</Button>
  </Actions>
</Home>
`.trim()

export const appHomeTodoApp = `
<!-- Ported from Slack Block Kit Builder template -->
<Home>
  <Actions>
    <Button value="create_task" style="primary">Create New TODO List</Button>
    <Button value="help">Help</Button>
  </Actions>
  <Context>
    <Image src="https://api.slack.com/img/blocks/bkb_template_images/placeholder.png" alt="placeholder" />
  </Context>

  <Section>
    <b>Today</b>
    <Overflow>
      <OverflowItem value="edit">:memo: Edit</OverflowItem>
      <OverflowItem value="delete">:x: Delete</OverflowItem>
    </Overflow>
  </Section>
  <Actions>
    <CheckboxGroup>
      <Checkbox value="option 1" checked>
        <s><b>Get into the garden :house_with_garden:</b></s>
      </Checkbox>
      <Checkbox value="option 2">
        <b>Get the groundskeeper wet :sweat_drops:</b>
      </Checkbox>
      <Checkbox value="option 3">
        <b>Steal the groundskeeper's keys :old_key:</b>
      </Checkbox>
      <Checkbox value="option 4">
        <b>Make the groundskeeper wear his sun hat :male-farmer:</b>
      </Checkbox>
      <Checkbox value="option 5">
        <b>Rake in the lake :ocean:</b>
      </Checkbox>
      <Checkbox value="option 6">
        <b>Have a picnic :knife_fork_plate:</b>
        <small>Bring to the picnic: sandwich, apple, pumpkin, carrot, basket</small>
      </Checkbox>
    </CheckboxGroup>
    <Button style="primary">Add Item</Button>
  </Actions>
  <Divider />

  <Section>
    <b>Tomorrow</b>
    <Overflow>
      <OverflowItem value="edit">:memo: Edit</OverflowItem>
      <OverflowItem value="delete">:x: Delete</OverflowItem>
    </Overflow>
  </Section>
  <Actions>
    <CheckboxGroup>
      <Checkbox value="option 1">
        <b>Break the broom :anger:</b>
      </Checkbox>
      <Checkbox value="option 2">
        <b>Trap the boy in the phone booth :phone:</b>
      </Checkbox>
      <Checkbox value="option 3">
        <b>Make the boy wear the wrong glasses :nerd_face:</b>
      </Checkbox>
      <Checkbox value="option 4">
        <b>Make someone buy back their own stuff :money_with_wings:</b>
      </Checkbox>
      <Checkbox value="option 5">
        <b>Get on TV :tv:</b>
      </Checkbox>
      <Checkbox value="option 6">
        <b>Go shopping :shopping_trolley:</b>
        <small>Toothbrush, hairbrush, tinned food, cleaner, fruits &amp; vegetables</small>
      </Checkbox>
    </CheckboxGroup>
    <Button style="primary">Add Item</Button>
  </Actions>
</Home>
`.trim()
