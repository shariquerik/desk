import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { createResource, createListResource } from "frappe-ui";
import { useAuthStore } from "@/stores/auth";
import { useError } from "@/composables/error";
import { Notification, Resource } from "@/types";

import { isCustomerPortal } from "@/utils";

export const useNotificationStore = defineStore("notification", () => {
  const authStore = useAuthStore();
  const visible = ref(false);
  const resource: Resource<Array<Notification>> = createListResource({
    doctype: "HD Notification",
    cache: "Notifications",
    filters: {
      user_to: ["=", authStore.userId],
    },
    fields: [
      "creation",
      "name",
      "notification_type",
      "read",
      "reference_comment",
      "reference_ticket",
      "user_from",
      "user_to",
    ],
    orderBy: "creation desc",
    auto: !isCustomerPortal.value,
  });
  const clear = createResource({
    url: "helpdesk.helpdesk.doctype.hd_notification.utils.clear",
    auto: false,
    onSuccess: () => resource.reload(),
  });

  const read = (ticket) => {
    createResource({
      url: "helpdesk.helpdesk.doctype.hd_notification.utils.clear",
      auto: true,
      params: {
        ticket: ticket,
      },
      onSuccess: () => resource.reload(),
    });
  };

  const data = computed(() => resource.data || []);
  const unread = computed(() => data.value.filter((d) => !d.read).length);

  function toggle() {
    visible.value = !visible.value;
  }

  return {
    clear,
    data,
    toggle,
    read,
    unread,
    visible,
  };
});
