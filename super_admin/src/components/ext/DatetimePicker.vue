<template>
    <v-menu
        :close-on-content-click="true"
        lazy
        transition="fade-transition"
        offset-y
        full-width
        max-width="290px"
        min-width="290px"
    >
        <v-text-field
            slot="activator"
            box
            append-icon="event"
            @blur="toDate = parseDate(toDateFormatted)"
            :rules="processRules(item.rules)"
            :value="formatDate(dataValue)"
        >
            <template slot="label">{{item['label']}} <span v-if="item.required" class="red--text darken-3">*</span></template>
        </v-text-field>
        <v-date-picker v-model="toDate" no-title></v-date-picker>
    </v-menu>
</template>

<script>
  export default {
    data () {
      return {
        toDateFormatted: null,
        toDate: null
      }
    },
    props: ['value', 'item', 'dataValue'],
    watch: {
        toDate (val) {
            this.toDateFormatted = this.formatDate(val)
            this.$emit('input', new Date(val).getTime())
        }
    },
    methods: {
        formatDate (date) {
            if (!date) return null
            let dateObj = new Date(date)
            return dateObj.getDate() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getFullYear()
        },
        parseDate (date) {
            if (!date) return null
            const [day, month, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },
        processRules (rulesStr) {
            return eval('( ' + rulesStr + ' )')
        }
    }
  }
</script>
