(define-constant CONTRACT_OWNER tx-sender)

(define-map UserRoles
  {user: principal}
  {roles: uint}
)

(define-map PermissionRoles
  {permission: (buff 50)}
  {roles: uint}
)


(define-read-only (get-roles (user principal)) 
  (default-to u0 (get roles (map-get? UserRoles {user: user})))
)


(define-read-only (has-role (user principal) (role uint))
  (begin 
    (asserts! (> u128 role) false)
    (let
      (
        (currentRoles (get-roles user))
        (searchRole (pow u2 role))
      )
      (> currentRoles (xor currentRoles searchRole))
    )
  )
)


(define-public (grant-role (user principal) (role uint))
  (begin
    (asserts! (> u128 role) (err "Role is out of range 0-127"))
    (asserts! (not (has-role user role)) (err "Role already granted"))
    (let
      (
        (currentRoles (get-roles user))
        (newRole (pow u2 role))
      )
      (map-set UserRoles
        {user: user}
        {roles: (+ currentRoles newRole)}
      )
      (ok true)
    )
  )
)


(define-public (revoke-role (user principal) (role uint))
  (begin
    (asserts! (> u128 role) (err "Role is out of range 0-127"))
    (asserts! (has-role user role) (err "Role already revoked"))
    (let
      (
        (currentRoles (get-roles user))
        (revokedRole (pow u2 role))
      )
      (map-set UserRoles
        {user: user}
        {roles: (- currentRoles revokedRole)}
      )
      (ok true)
    )
  )
)


(define-read-only (get-permitted-roles (permission (buff 50)))
  (default-to u0 (get roles (map-get? PermissionRoles {permission: permission})))
)

(define-read-only (has-permission (role uint) (permission (buff 50)))
  (begin 
    (asserts! (> u128 role) false)
    (let
      (
        (currentRoles (get-permitted-roles permission))
        (searchRole (pow u2 role))
      )
      (> currentRoles (xor currentRoles searchRole))
    )
  )
)

(define-public (grant-permission (permission (buff 50)) (role uint))
  (begin
    (asserts! (> u128 role) (err "Role is out of range 0-127"))
    (asserts! (not (has-permission role permission)) (err "Permission already granted"))
    (let
      (
        (currentRoles (get-permitted-roles permission))
        (newRole (pow u2 role))
      )
      (map-set PermissionRoles
        {permission: permission}
        {roles: (+ currentRoles newRole)}
      )
      (ok true)
    )
  )
)


(define-public (revoke-permission (permission (buff 50)) (role uint))
  (begin
    (asserts! (> u128 role) (err "Role is out of range 0-127"))
    (asserts! (has-permission role permission) (err "Permission already revoked"))
    (let
      (
        (currentRoles (get-permitted-roles permission))
        (revokedRole (pow u2 role))
      )
      (map-set PermissionRoles
        {permission: permission}
        {roles: (- currentRoles revokedRole)}
      )
      (ok true)
    )
  )
)