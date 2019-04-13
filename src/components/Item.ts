import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { PaperItemObject, $iMap, PaperItemRenderer } from '@/model'

@Component
export class ItemMixin extends Vue {
  @Prop({ required: true }) element!: PaperItemObject

  get context() {
    return {}
  }

  @Watch('context', { deep: true })
  OnContextChanged() {
    let item = $iMap.Get<PaperItemRenderer>(this.element.id)!
    item.Render()
  }

  @Watch('element.coordinate', { deep: true })
  OnCoordinateChanged() {
    let item = $iMap.Get<PaperItemRenderer>(this.element.id)!
    item.UpdateCoordinate()
  }

  @Watch('element.opacity')
  OnOpacityChanged() {
    let item = $iMap.Get<PaperItemRenderer>(this.element.id)!
    item.UpdateOpacity()
  }

  @Watch('element.visible')
  OnVisibleChanged() {
    let item = $iMap.Get<PaperItemRenderer>(this.element.id)!
    item.UpdateVisible()
  }

  mounted() {
    let item = $iMap.Get<PaperItemRenderer>(this.element.id)!
    item.Render()
  }
}
