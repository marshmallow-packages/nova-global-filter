export default {
  data: () => ({
    selectedFilters: {
      type: Array,
    },
  }),

  created() {
    Nova.$on('global-filter-changed', filter => {
      this.selectedFilters[filter.class] = filter.currentValue;

      if (filter.currentValue === '' || JSON.stringify(filter.currentValue) === JSON.stringify({})) {
        delete this.selectedFilters[filter.class];
      }

      this.fetch();
    });
  },

  computed: {
    /**
     * @returns {string}
     */
    globalMetricEndpoint() {
      const lens = this.lens !== '' ? `/lens/${this.lens}` : '';

      if (this.resourceName && this.resourceId) {
        return `/nova-api/${this.resourceName}${lens}/${this.resourceId}/metrics/${this.card.uriKey}`;
      } else if (this.resourceName) {
        return `/nova-api/${this.resourceName}${lens}/metrics/${this.card.uriKey}`;
      }

      return `/nova-api/dashboards/cards/${this.dashboard}/metrics/${this.card.uriKey}`;
    },
  },

  methods: {
    filterPayload() {
      const payload = {
        params: {
          timezone: this.userTimezone,
          twelveHourTime: this.usesTwelveHourTime,
        },
      };

      if (this.hasRanges) {
        payload.params.range = this.selectedRangeKey;
      }

      if (JSON.stringify(this.selectedFilters) !== JSON.stringify({})) {
        payload.params.filters = this.selectedFilters;
      }

      return payload;
    },
  },
};
