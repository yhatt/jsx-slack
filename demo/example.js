export const message = `
<Blocks>
  <Section>
    <p>
      Enjoy building blocks!
    </p>
    <blockquote>
      <b>
        <a href="https://github.com/speee/jsx-slack">@speee-js/jsx-slack</a>
      </b>
      <br />
      <i>Build JSON for Slack Block Kit from JSX</i>
    </blockquote>
    <Image src="https://github.com/speee.png" alt="Speee, Inc." />
  </Section>
  <Context>
    Maintained by <a href="https://github.com/yhatt">Yuki Hattori</a>
    <img src="https://github.com/yhatt.png" alt="yhatt" />
  </Context>
  <Divider />
  <Actions>
    <Button url="https://github.com/speee/jsx-slack">GitHub</Button>
    <Button url="https://www.npmjs.com/package/@speee-js/jsx-slack">npm</Button>
  </Actions>
</Blocks>
`.trim()

export const modal = `
<Modal title="My first modal" close="Cancel">
  <Section>
    <p>
      <strong>It's my first modal!</strong> :sunglasses:
    </p>
    <p>jsx-slack also has supported Slack Modals.</p>
  </Section>
  <Divider />

  <Input type="text" name="subject" label="Subject" required />
  <Textarea name="message" label="Message" maxLength="500" />
  <ConversationsSelect name="shareWith" label="Share with..." required />

  <Input type="hidden" name="postId" value="xxxx" />
  <Input type="submit" value="Send" />
</Modal>
`.trim()

export const home = `
<Home>
  <Image src="https://source.unsplash.com/random/960x240?home" alt="home" />
  <Section>
    <b>Welcome back to my home!</b> :house_with_garden:
  </Section>
  <Divider />
  <Section>What's next?</Section>
  <Actions>
    <Button actionId="tickets">See assigned tickets to me :ticket:</Button>
    <Button actionId="reminder">Remind a task later :memo:</Button>
    <Button actionId="pomodoro">Start pomodoro timer :tomato:</Button>
  </Actions>
</Home>
`.trim()

export const dialog = `
<!-- ⚠️ Please notice that dialog components were deprecated. -->
<Dialog callbackId="createUser" title="Create user">
  <Input name="name" label="Name" required />
  <Textarea name="desc" label="Description" maxLength="300" />

  <Select name="role" label="Role" value="regular" required>
    <Option value="regular">Regular</Option>
    <Option value="leader">Leader</Option>
    <Option value="admin">Admin</Option>
  </Select>

  <Input type="hidden" name="userId" value="xxxxxxxx" />
  <Input type="submit" value="Create" />
</Dialog>
`.trim()
