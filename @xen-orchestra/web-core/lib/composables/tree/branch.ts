import { TreeNodeBase } from '@core/composables/tree/tree-node-base'
import type { CollectionContext, TreeNode, TreeNodeOptions } from '@core/composables/tree/types'

export class Branch<
  TData extends object = any,
  TChild extends TreeNode = TreeNode,
  const TDiscriminator = any,
> extends TreeNodeBase<TData, TDiscriminator> {
  readonly isBranch = true
  readonly rawChildren: TChild[]

  constructor(
    data: TData,
    parent: Branch | undefined,
    context: CollectionContext,
    depth: number,
    options: TreeNodeOptions<TData, TDiscriminator> | undefined,
    getChildren: (thisBranch: Branch<TData, TChild, TDiscriminator>) => TChild[]
  ) {
    super(data, parent, context, depth, options)
    this.rawChildren = getChildren(this)
  }

  get children() {
    return this.rawChildren.filter(child => child.isVisible)
  }

  get passesFilterDownwards(): boolean {
    return this.passesFilter || this.rawChildren.some(child => child.passesFilterDownwards)
  }

  get isVisible() {
    if (this.passesFilterUpwards || this.passesFilterDownwards) {
      return true
    }

    if (this.passesFilter === false) {
      return false
    }

    return this.parent?.isExpanded ?? true
  }

  get isExpanded() {
    return this.context.expandedNodes.has(this.id) || this.passesFilterDownwards || this.passesFilterUpwards
  }

  get areChildrenFullySelected(): boolean {
    if (!this.context.allowMultiSelect) {
      console.warn('allowMultiSelect must be enabled to use areChildrenFullySelected')
      return false
    }

    return this.rawChildren.every(child => (child.isBranch ? child.areChildrenFullySelected : child.isSelected))
  }

  get areChildrenPartiallySelected(): boolean {
    if (!this.context.allowMultiSelect) {
      console.warn('allowMultiSelect must be enabled to use areChildrenPartiallySelected')
      return false
    }

    if (this.areChildrenFullySelected) {
      return false
    }

    return this.rawChildren.some(child => (child.isBranch ? child.areChildrenPartiallySelected : child.isSelected))
  }

  get labelClasses() {
    return {
      active: this.isActive,
      selected: this.isSelected,
      matches: this.passesFilter === true,
      'selected-partial': this.context.allowMultiSelect && this.areChildrenPartiallySelected,
      'selected-full': this.context.allowMultiSelect && this.areChildrenFullySelected,
      expanded: this.isExpanded,
    }
  }

  get childrenSelectedState() {
    console.warn('allowMultiSelect must be enabled to use childrenSelectedState')
    return this.areChildrenFullySelected ? 'all' : this.areChildrenPartiallySelected ? 'some' : 'none'
  }

  toggleExpand(forcedValue?: boolean, recursive?: boolean) {
    const nextExpanded = forcedValue ?? !this.isExpanded

    if (nextExpanded) {
      this.context.expandedNodes.set(this.id, this as TreeNode)
    } else {
      this.context.expandedNodes.delete(this.id)
    }

    const shouldPropagate = recursive ?? !nextExpanded

    if (shouldPropagate) {
      this.rawChildren.forEach(child => {
        if (child.isBranch) {
          child.toggleExpand(nextExpanded, recursive)
        }
      })
    }
  }

  toggleChildrenSelect(forcedValue?: boolean) {
    if (!this.context.allowMultiSelect) {
      console.warn('allowMultiSelect must be enabled to use toggleChildrenSelect')
      return
    }

    const shouldSelect = forcedValue ?? !this.areChildrenFullySelected
    this.rawChildren.forEach(child => {
      child instanceof Branch ? child.toggleChildrenSelect(shouldSelect) : child.toggleSelect(shouldSelect)
    })
  }
}
