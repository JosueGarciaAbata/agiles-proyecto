<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MaintenanceDetailRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'dni_res_main' => 'required|string|exists:responsibles,dni_res',
            'cod_main' => 'required|string|max:10|unique:maintenances,cod_main',
            'id_typ_main' => 'required|exists:type_maintenances,id',
            'vis_main' => 'nullable|in:V,H',
            'ended_at' => 'nullable|date|after:created_at',
            'created_at' => 'required|date',

            // Validar los assets
            'assets' => 'required|array',
            'assets.*.id' => 'required|exists:assets,id',
            'assets.*.observations' => 'nullable|array',
            'assets.*.observations.*.des_obs' => 'required|string',
            'assets.*.replaced_components' => 'nullable|array',
            'assets.*.replaced_components.*.id_com_bel' => 'required|exists:components,id',
            'assets.*.replaced_components.*.des_rep_com' => 'required|string',
            'assets.*.activities' => 'nullable|array',
            'assets.*.activities.*' => 'required|exists:activities,id',
        ];

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['cod_main'] = [
                'required',
                'string',
                'max:10',
                Rule::unique('maintenances', 'cod_main')->ignore($this->route('id')),
            ];


        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'dni_res_main.required' => 'La cédula del responsable es obligatoria.',
            'dni_res_main.exists' => 'El responsable especificado no existe.',
            'cod_main.required' => 'El código de mantenimiento es obligatorio.',
            'cod_main.unique' => 'El código de mantenimiento ya está en uso.',
            'cod_main.max' => 'El código de mantenimiento no puede superar los 10 caracteres.',
            'id_typ_main.required' => 'El tipo de mantenimiento es obligatorio.',
            'id_typ_main.exists' => 'El tipo de mantenimiento especificado no existe.',
            'vis_main.in' => 'La visibilidad debe ser uno de los siguientes: V (visible) o H (hidden).',
            'ended_at.date' => 'La fecha de finalización debe ser válida.',
            'ended_at.after' => 'La fecha de finalización debe ser posterior a la fecha de creación.',
            'created_at.required' => 'La fecha de creación es obligatoria.',
            'created_at.date' => 'La fecha de creación debe ser válida.',

            // Mensajes para assets
            'assets.required' => 'Los activos (assets) son obligatorios.',
            'assets.array' => 'Los activos deben ser un arreglo.',
            'assets.*.id.required' => 'El ID del asset es obligatorio.',
            // Mensajes para observaciones
            'assets.*.observations.array' => 'Las observaciones deben ser un arreglo.',
            'assets.*.observations.*.des_obs.required' => 'La descripción de la observación es obligatoria.',
            'assets.*.observations.*.des_obs.string' => 'La descripción de la observación debe ser una cadena de texto.',
            'assets.*.observations.*.id.required' => 'El ID de la observación es obligatorio.',
            'assets.*.observations.*.id.exists' => 'La observación especificada no existe.',

            // Mensajes para componentes reemplazados
            'assets.*.replaced_components.array' => 'Los componentes reemplazados deben ser un arreglo.',
            'assets.*.replaced_components.*.id_com_bel.required' => 'El ID del componente es obligatorio.',
            'assets.*.replaced_components.*.id_com_bel.exists' => 'El componente especificado no existe.',
            'assets.*.replaced_components.*.des_rep_com.required' => 'La descripción del componente reemplazado es obligatoria.',
            'assets.*.replaced_components.*.des_rep_com.string' => 'La descripción del componente reemplazado debe ser una cadena de texto.',
            'assets.*.replaced_components.*.id.required' => 'El ID del componente reemplazado es obligatorio.',
            'assets.*.replaced_components.*.id.exists' => 'El componente reemplazado especificado no existe.',

            // Mensajes para actividades
            'assets.*.activities.array' => 'Las actividades deben ser un arreglo.',
            'assets.*.activities.*.required' => 'Cada actividad debe estar especificada.',
            'assets.*.activities.*.exists' => 'La actividad especificada no existe.',
        ];
    }
}
