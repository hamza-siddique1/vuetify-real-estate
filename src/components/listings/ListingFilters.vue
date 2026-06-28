<template>
    <div class="filter-bar d-flex align-items-center justify-content-center">
  <div class="d-flex align-items-center gap-2" style="margin-right: 8%;">

    <!-- All Listings (property type) custom dropdown -->
    <div class="dropdown">
      <button class="fb-select-btn show" type="button" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="true" id="dd-type-btn" style="min-width:152px;">
        <span id="dd-type-label">All Listings</span>
        <svg class="fb-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <ul class="dropdown-menu fb-select-menu show" style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate3d(0px, 40px, 0px);" data-popper-placement="bottom-start">
        <li><button class="dropdown-item is-selected" onclick="setDropdown('type','','All Listings',this)">All Listings</button></li>
        <li><button class="dropdown-item" onclick="setDropdown('type','Residential','Residential',this)">Residential</button></li>
        <li><button class="dropdown-item" onclick="setDropdown('type','Condos','Condos',this)">Condos</button></li>
        <li><button class="dropdown-item" onclick="setDropdown('type','Townhome','Townhome',this)">Townhome</button></li>
        <li><button class="dropdown-item" onclick="setDropdown('type','Semi Detached','Semi Detached',this)">Semi Detached</button></li>
        <li><button class="dropdown-item" onclick="setDropdown('type','Multi Family','Multi Family',this)">Multi Family</button></li>
        <li><button class="dropdown-item" onclick="setDropdown('type','Land','Land',this)">Land</button></li>
        <li><button class="dropdown-item" onclick="setDropdown('type','Business','Business',this)">Business</button></li>
        <li><button class="dropdown-item" onclick="setDropdown('type','Commercial','Commercial',this)">Commercial</button></li>
      </ul>
    </div>

    <!-- Both / Status custom dropdown -->
    <div class="dropdown">
      <button class="fb-select-btn" type="button" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false" id="dd-status-btn" style="min-width:108px;">
        <span id="dd-status-label">Both</span>
        <svg class="fb-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <ul class="dropdown-menu fb-select-menu">
        <li><button class="dropdown-item is-selected" onclick="setDropdown('status','','Both',this)">Both</button></li>
        <li><button class="dropdown-item" onclick="setDropdown('status','For Sale','For Sale',this)">For Sale</button></li>
        <li><button class="dropdown-item" onclick="setDropdown('status','For Rent','For Rent',this)">For Rent</button></li>
        <li><button class="dropdown-item" onclick="setDropdown('status','Sold','Sold',this)">Sold</button></li>
      </ul>
    </div>

    <!-- Advanced — green border, green icon -->
    <button class="fb-btn fb-btn-advanced" type="button" data-bs-toggle="offcanvas" data-bs-target="#advancedDrawer">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line>
        <line x1="4" y1="18" x2="20" y2="18"></line>
        <circle cx="9" cy="6" r="2" fill="#fff"></circle><circle cx="16" cy="12" r="2" fill="#fff"></circle>
        <circle cx="9" cy="18" r="2" fill="#fff"></circle>
      </svg>
      Advanced
    </button>

  </div>
</div>
</template>
