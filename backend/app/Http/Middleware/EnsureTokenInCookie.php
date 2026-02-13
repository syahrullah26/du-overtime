<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenInCookie
{
    /**
     * handle incoming requestnya nanti
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        
        if ($request->header('Authorization')) {
            return $next($request);
        }

        // cek auth_token cookie
        $token = $request->cookie('auth_token');

        if ($token) {
            if (str_contains($token, '%')) {
                $token = urldecode($token);
            }

            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}
