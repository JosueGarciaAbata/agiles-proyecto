<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ResponsibleRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            "dni_res" => "required|string|size:10|unique:responsibles,dni_res|unique:users,dni_usr",
            "nam_res" => "required|string|max:20",
            "las_res" => "required|string|max:20",
            "ema_res" => "required|email|max:50|unique:responsibles,ema_res",
            "pho_res" => "required|string|size:10|unique:responsibles,pho_res",
            "is_ext" => "required|in:Y,N",
        ];
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules["dni_res"] = "nullable";
            $rules['ema_res'] = [
                'required',
                'email',
                'max:50',
                Rule::unique('responsibles', 'ema_res')->ignore($this->dni_res, 'dni_res')
            ];
            $rules['pho_res'] = [
                'required',
                'string',
                'size:10',
                Rule::unique('responsibles', 'pho_res')->ignore($this->dni_res, 'dni_res')
            ];
        }
        return $rules;

    }
    public function messages(): array
    {
        return [
            "dni_res.required" => "El DNI es obligatorio.",
            "dni_res.string" => "El DNI debe ser una cadena de texto.",
            "dni_res.size" => "El DNI debe tener exactamente 10 caracteres.",

            "nam_res.required" => "El nombre es obligatorio.",
            "nam_res.string" => "El nombre debe ser una cadena de texto.",
            "nam_res.max" => "El nombre no debe exceder los 20 caracteres.",

            "las_res.required" => "El apellido es obligatorio.",
            "las_res.string" => "El apellido debe ser una cadena de texto.",
            "las_res.max" => "El apellido no debe exceder los 20 caracteres.",

            "ema_res.required" => "El correo electrónico es obligatorio.",
            "ema_res.email" => "El correo electrónico debe tener un formato válido.",
            "ema_res.max" => "El correo electrónico no debe exceder los 50 caracteres.",
            "ema_res.unique" => "El email ya esta registrado",

            "pho_res.required" => "El teléfono es obligatorio.",
            "pho_res.string" => "El teléfono debe ser una cadena de texto.",
            "pho_res.size" => "El teléfono debe tener exactamente 10 caracteres.",
            "pho_res.unique" => "El teléfono ya está registrado.",

            "is_ext.required" => "Debe especificar si es externo o no.",
            "is_ext.in" => "El valor de 'is_ext' debe ser 'Y' o 'N'.",
        ];
    }
}
