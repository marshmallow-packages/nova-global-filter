<?php

namespace Marshmallow\NovaGlobalFilter;

use Illuminate\Database\Eloquent\Builder;
use Laravel\Nova\Http\Requests\NovaRequest;

trait GlobalFilterable
{
    public function globalFiltered(NovaRequest $request, $model, $filters = [])
    {
        $model = $model instanceof Builder ? $model : (new $model)->newQuery();

        if ($request->has('filters')) {

            $request->range = optional($request)->range ?? 3600;

            foreach (json_decode($request->filters, true) as $filter => $value) {
                if (empty($value) || !in_array($filter, $filters)) {
                    continue;
                }

                $model = (new $filter)->apply($request, $model, $value);
            }
        } else {
            foreach ($filters as $filter) {
                $currentFilter = new $filter;

                if (!empty($currentFilter->default())) {
                    $model = $currentFilter->apply($request, $model, $currentFilter->default());
                }
            }
        }
        return $model;
    }
}
