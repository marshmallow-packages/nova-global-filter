<template>
  <BasePartitionMetric
    :title="card.name"
    :help-text="card.helpText"
    :help-width="card.helpWidth"
    :chart-data="chartData"
    :loading="loading"
    :legends-height="card.height"
  />
</template>

<script>
import { MetricBehavior } from 'laravel-nova-mixins';
import FilterBehavior from './FilterBehavior';
import { minimum } from 'laravel-nova-util';

export default {
  name: 'PartitionMetric',

  mixins: [MetricBehavior, FilterBehavior],

  data: () => ({
    loading: true,
    chartData: [],
  }),

  watch: {
    resourceId() {
      this.fetch();
    },
  },

  created() {
    this.fetch();
  },

  mounted() {
    if (this.card && this.card.refreshWhenFiltersChange === true) {
      Nova.$on('filter-changed', this.fetch);
      Nova.$on('filter-reset', this.fetch);
    }
  },

  beforeUnmount() {
    if (this.card && this.card.refreshWhenFiltersChange === true) {
      Nova.$off('filter-changed', this.fetch);
      Nova.$off('filter-reset', this.fetch);
    }
  },

  methods: {
    fetch() {
      this.loading = true;

      minimum(Nova.request().get(this.globalMetricEndpoint, this.filterPayload())).then(this.handleFetchCallback());
    },

    handleFetchCallback() {
      return ({
        data: {
          value: { value },
        },
      }) => {
        this.chartData = value;
        this.loading = false;
      };
    },
  },

  computed: {
    metricPayload() {
      const payload = { params: {} };

      if (!Nova.missingResource(this.resourceName) && this.card && this.card.refreshWhenFiltersChange === true) {
        payload.params.filter = this.$store.getters[`${this.resourceName}/currentEncodedFilters`];
      }

      return payload;
    },
  },
};
</script>
