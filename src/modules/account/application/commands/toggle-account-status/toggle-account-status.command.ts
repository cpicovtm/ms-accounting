export class ToggleAccountStatusCommand {
  public readonly id: string;
  public readonly isActive: boolean;

  constructor(props: { id: string; isActive: boolean }) {
    this.id = props.id;
    this.isActive = props.isActive;
  }
}
