import paper from 'paper'
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { PaperItemObject, $iMap, PaperItemRenderer, PaperItem, GetItemType } from '@/model'

@Component
export class BasicMixin extends Vue {
  @Prop({ required: true }) element!: PaperItemObject

  rendererId: number = -1

  get context() {
    return {}
  }

  @Watch('context', { deep: true })
  OnContextChanged() {
    $iMap.Get<PaperItemRenderer>(this.rendererId)!.Render(this.element)
    this.$emit('draw', this.rendererId)
  }

  @Watch('element.coordinate', { deep: true })
  OnCoordinateChanged() {
    $iMap.Get<PaperItemRenderer>(this.rendererId)!.UpdateCoordinate(this.element.coordinate)
  }

  @Watch('element.opacity')
  OnOpacityChanged() {
    $iMap.Get<PaperItemRenderer>(this.rendererId)!.UpdateOpacity(this.element.opacity)
  }

  @Watch('element.visible')
  OnVisibleChanged() {
    $iMap.Get<PaperItemRenderer>(this.rendererId)!.UpdateVisible(this.element.visible)
  }

  On(type: string, event?: paper.Event) {
    this.$emit(type, event)
  }

  CreateRenderer(): PaperItemRenderer {
    let constructor = GetItemType(this.element.type)!
    let renderer = new constructor() as PaperItemRenderer
    this.rendererId = renderer.id
    return renderer
  }

  mounted() {
    let renderer = $iMap.Get<PaperItemRenderer>(this.rendererId)
    if (!renderer) {
      renderer = this.CreateRenderer()
    }
    renderer.On((type, event) => this.On(type, event))
    renderer.Render(this.element)
    this.$emit('draw', this.rendererId)
  }

  beforeDestroy() {
    let renderer = $iMap.Get<PaperItemRenderer>(this.rendererId)
    if (renderer) {
      renderer.Destroy()
    }
  }
}
