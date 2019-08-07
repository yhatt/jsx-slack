export const blockKit = `
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

export const dialog = `
<Dialog callbackId="createUser" title="Create user">
  <Input name="name" label="Name" required />
  <Textarea name="desc" label="Description" maxLength="300" />

  <!-- NOTE: Unprefixed Select also would work in Dialog container. -->
  <Dialog.Select name="role" label="Role" value="regular" required>
    <Option value="regular">Regular</Option>
    <Option value="leader">Leader</Option>
    <Option value="admin">Admin</Option>
  </Dialog.Select>

  <Input type="hidden" name="userId" value="xxxxxxxx" />
  <Input type="submit" value="Create" />
</Dialog>
`.trim()
