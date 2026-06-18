<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    protected $fillable = [
        "id_inc_ass",
        "id_cat_ass",
        "id_loc_ass",
        "cod_ass",
        "ser_num_ass",
        "obs_add_ass",
        'est_ass'
    ];

    public function income()
    {
        return $this->belongsTo(Income::class, "id_inc_ass");
    }

    public function category()
    {
        return $this->belongsTo(Category::class, "id_cat_ass");
    }

    public function location()
    {
        return $this->belongsTo(Location::class, "id_loc_ass");
    }

    public function components()
    {
        return $this->belongsToMany(Component::class, 'asset_component')
            ->withPivot('description')
            ->withTimestamps();
    }

    public function maintenanceDetails()
    {
        return $this->hasMany(MaintenanceDetail::class, 'id_ass_bel');
    }
}
