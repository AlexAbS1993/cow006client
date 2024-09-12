export class Select {
    selectedObject: any;
    eventName: string;
    addSelected(obj: any): this;
    removeSelected(): void;
    isSelected(): boolean;
    getSelectedObject(): any;
}
