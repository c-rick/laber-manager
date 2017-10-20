
<template>

  <div @click="focusNewTag()" :class="{'read-only': readOnly}" class="vue-input-tag-wrapper">
    <span v-for="(tag, index) in (tags.length > 0 ? tags : null)" :key="index" class="input-tag">
      <span v-text="tag"></span>
      <a v-if="!readOnly" @click.prevent.stop="remove(index)" class="remove"></a>
    </span>
    <input v-if="!readOnly" v-bind:placeholder="placeholder" type="text" v-model="newTag" v-on:keydown.delete.stop="removeLastTag()" v-on:keydown.enter.188.tab.prevent.stop="addNew(newTag)" class="new-tag"/>
  </div>

</template>
<script>
  export default {
    name: 'InputTag',
    props: {
      tags: {
        type: Array,
        default: () => []
      },
      placeholder: {
        type: String,
        default: ''
      },
      onChange: {
        type: Function
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      max: {
        type: Number
      }
    },
    data () {
      return {
        newTag: ''
      }
    },
    methods: {
      focusNewTag () {
        if (this.readOnly) { return }
        this.$el.querySelector('.new-tag').focus()
      },
      addNew (tag) {
        if (this.max && this.tags.length >= this.max) {
          this.$message({
            message: '超过最大设置值',
            duration: 1000
          })
        } else if (tag && this.tags.indexOf(tag) === -1) {
          this.tags.push(tag)
          this.tagChange()
        }
        this.newTag = ''
      },
      remove (index) {
        this.tags.splice(index, 1)
        this.tagChange()
      },
      removeLastTag () {
        if (this.newTag) { return }
        this.tags.pop()
        this.tagChange()
      },
      tagChange () {
        if (this.onChange) {
          // avoid passing the observer
          this.onChange(JSON.parse(JSON.stringify(this.tags)))
        }
      }
    }
  }
</script>
<style>
  .vue-input-tag-wrapper {
    background-color: #fff;
    border-radius: 5px;
    overflow: hidden;
    padding: 2px 10px;
    cursor: text;
    text-align: left;
    -webkit-appearance: textfield;
  }
  .vue-input-tag-wrapper .input-tag {
    background-color: #90d7ec;
    border-radius: 5px;
    color: #fff;
    display: inline-block;
    font-size: 13px;
    font-weight: 400;
    margin-bottom: 4px;
    margin-right: 4px;
    line-height: 16px;
    padding: 3px;
  }
  .vue-input-tag-wrapper .input-tag .remove {
    cursor: pointer;
    font-weight: bold;
    color: #eee;
  }
  .vue-input-tag-wrapper .input-tag .remove:hover {
    text-decoration: none;
  }
  .vue-input-tag-wrapper .input-tag .remove::before {
    content: " x";
  }
  .vue-input-tag-wrapper .new-tag {
    background: transparent;
    border: 0;
    color: #777;
    font-size: 13px;
    font-weight: 400;
    height: 100%;
    outline: none;
    padding: 4px;
    padding-left: 0;
    width: 80px;
  }
  .vue-input-tag-wrapper.read-only {
    cursor: default;
  }
</style>