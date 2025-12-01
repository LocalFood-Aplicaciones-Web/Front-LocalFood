import {ColleaguesApi} from "../infrastructure/colleagues-api.js";
import {GroupsApi} from "../infrastructure/groups-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {ColleagueAssembler} from "../infrastructure/colleague.assembler.js";
import {GroupAssembler} from "../infrastructure/group.assembler.js";

const colleaguesApi = new ColleaguesApi();

/**
 * Pinia store for managing Colleagues and Groups state.
 * Handles CRUD operations for colleagues and groups.
 * @returns {Object} The store object with state and actions.
 */
const useColleaguesStore = defineStore('colleagues', () => {
    /** @type {import('vue').Ref<Array<Colleague>>} Array of colleague entities. */
    const colleagues = ref([]);
    
    /** @type {import('vue').Ref<Array<Group>>} Array of group entities. */
    const groups = ref([]);
    
    /** @type {import('vue').Ref<Array<Error>>} Array of error messages. */
    const errors = ref([]);
    
    /** @type {import('vue').Ref<boolean>} Flag indicating if colleagues have been loaded. */
    const colleaguesLoaded = ref(false);
    
    /** @type {import('vue').Ref<boolean>} Loading state. */
    const isLoading = ref(false);
    
    /** @type {import('vue').Ref<Colleague|null>} Currently selected colleague. */
    const selectedColleague = ref(null);

    // Get current user ID from localStorage
    function getCurrentUserId() {
        return localStorage.getItem('userId') || 'guest';
    }

    // Save to localStorage
    function saveToLocalStorage() {
        const userId = getCurrentUserId();
        const storageKey = `colleagues_${userId}`;
        const groupsKey = `groups_${userId}`;
        localStorage.setItem(storageKey, JSON.stringify(colleagues.value));
        localStorage.setItem(groupsKey, JSON.stringify(groups.value));
    }

    // Load from localStorage
    function loadFromLocalStorage() {
        const userId = getCurrentUserId();
        const storageKey = `colleagues_${userId}`;
        const groupsKey = `groups_${userId}`;
        const storedColleagues = localStorage.getItem(storageKey);
        const storedGroups = localStorage.getItem(groupsKey);
        
        if (storedColleagues) {
            colleagues.value = JSON.parse(storedColleagues);
        }
        if (storedGroups) {
            groups.value = JSON.parse(storedGroups);
        }
    }

    /**
     * @type {import('vue').ComputedRef<number>} Total count of colleagues.
     */
    const colleaguesCount = computed(() => colleagues.value.length);

    /**
     * Get colleagues by group ID
     */
    const colleaguesByGroup = computed(() => (groupId) => {
        return colleagues.value.filter(c => c.groupId == groupId); // Usar == para comparación flexible
    });

    /**
     * Get colleagues without group
     */
    const colleaguesWithoutGroup = computed(() => {
        return colleagues.value.filter(c => !c.groupId);
    });

    /**
     * Fetches all colleagues from the API.
     * @throws {Error} If fetching colleagues fails.
     */
    async function fetchColleagues() {
        isLoading.value = true;
        try {
            const userId = getCurrentUserId();
            const response = await colleaguesApi.getColleagues();
            const allColleagues = ColleagueAssembler.toEntitiesFromResponse(response);
            // Filter by current user
            colleagues.value = allColleagues.filter(c => c.userId == userId);
            colleaguesLoaded.value = true;
            saveToLocalStorage();
            errors.value = [];
        } catch (error) {
            console.error('Error fetching colleagues:', error);
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Fetches a single colleague by ID.
     * @param {number|string} id - The colleague ID.
     */
    async function fetchColleagueById(id) {
        isLoading.value = true;
        try {
            const response = await colleaguesApi.getColleagueById(id);
            const resource = ColleagueAssembler.toResourceFromResponse(response);
            if (resource) {
                selectedColleague.value = ColleagueAssembler.toEntityFromResource(resource);
                errors.value = [];
            }
        } catch (error) {
            console.error('Error fetching colleague:', error);
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Adds a new colleague.
     * @param {Object} colleagueData - The colleague data object.
     * @throws {Error} If adding the colleague fails.
     */
    async function addColleague(colleagueData) {
        isLoading.value = true;
        try {
            const userId = getCurrentUserId();
            const dataWithUser = { ...colleagueData, userId: parseInt(userId) };
            const response = await colleaguesApi.addColleague(dataWithUser);
            const resource = ColleagueAssembler.toResourceFromResponse(response);
            if (resource) {
                const newColleague = ColleagueAssembler.toEntityFromResource(resource);
                colleagues.value.push(newColleague);
                console.log(`Colleague added: ${newColleague.name}`);
                saveToLocalStorage();
                errors.value = [];
                return true;
            } else {
                console.error('Failed to add colleague');
                errors.value.push(new Error('Failed to add colleague'));
                return false;
            }
        } catch (error) {
            console.error('Error adding colleague:', error);
            errors.value.push(error);
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Updates an existing colleague.
     * @param {Object} colleagueData - The colleague data object with id.
     * @throws {Error} If updating the colleague fails.
     */
    async function updateColleague(colleagueId, colleagueData) {
        isLoading.value = true;
        try {
            // Siempre incluir el userId actual para mantener la asociación
            const userId = getCurrentUserId();
            const dataWithUser = { 
                ...colleagueData, 
                userId: parseInt(userId) || userId 
            };
            
            const response = await colleaguesApi.updateColleague(colleagueId, dataWithUser);
            const resource = ColleagueAssembler.toResourceFromResponse(response);
            if (resource) {
                const updatedColleague = ColleagueAssembler.toEntityFromResource(resource);
                const index = colleagues.value.findIndex(c => c.id == colleagueId);
                if (index !== -1) {
                    colleagues.value[index] = updatedColleague;
                }
                saveToLocalStorage();
                errors.value = [];
                return true;
            } else {
                errors.value.push(new Error('Failed to update colleague'));
                return false;
            }
        } catch (error) {
            console.error('Error updating colleague:', error);
            errors.value.push(error);
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Deletes a colleague.
     * @param {string|number} colleagueId - The colleague ID to delete.
     * @throws {Error} If deleting the colleague fails.
     */
    async function deleteColleague(colleagueId) {
        isLoading.value = true;
        try {
            await colleaguesApi.deleteColleague(colleagueId);
            colleagues.value = colleagues.value.filter(c => c.id != colleagueId);
            console.log(`Colleague deleted: ${colleagueId}`);
            saveToLocalStorage();
            errors.value = [];
            return true;
        } catch (error) {
            console.error('Error deleting colleague:', error);
            errors.value.push(error);
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Clears all errors.
     */
    function clearErrors() {
        errors.value = [];
    }

    /**
     * Selects a colleague.
     * @param {Colleague} colleague - The colleague to select.
     */
    function selectColleague(colleague) {
        selectedColleague.value = colleague;
    }

    /**
     * Clears the selected colleague.
     */
    function clearSelection() {
        selectedColleague.value = null;
    }

    // ========== GROUPS ACTIONS ==========

    /**
     * Fetches all groups from the API.
     */
    async function fetchGroups() {
        isLoading.value = true;
        try {
            const userId = getCurrentUserId();
            const data = await GroupsApi.getAll();
            console.log('🔍 ALL groups from API:', data);
            const allGroups = data.map(resource => GroupAssembler.toDomain(resource));
            console.log('🔍 Mapped groups:', allGroups);
            // Filter by current user
            groups.value = allGroups.filter(g => g.userId == userId);
            console.log('🔍 Filtered groups:', groups.value);
            console.log(`Loaded ${groups.value.length} groups for user ${userId}.`);
            saveToLocalStorage();
            errors.value = [];
        } catch (error) {
            console.error('Error fetching groups:', error);
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Adds a new group.
     */
    async function addGroup(groupData) {
        isLoading.value = true;
        try {
            const userId = getCurrentUserId();
            const dataWithUser = { ...groupData, userId: parseInt(userId) };
            const created = await GroupsApi.create(dataWithUser);
            const newGroup = GroupAssembler.toDomain(created);
            groups.value.push(newGroup);
            console.log(`Group added: ${newGroup.name}`);
            saveToLocalStorage();
            errors.value = [];
            return newGroup;
        } catch (error) {
            console.error('Error adding group:', error);
            errors.value.push(error);
            throw error;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Updates an existing group.
     */
    async function updateGroup(id, groupData) {
        isLoading.value = true;
        try {
            const updated = await GroupsApi.update(id, groupData);
            const updatedGroup = GroupAssembler.toDomain(updated);
            const index = groups.value.findIndex(g => g.id === id);
            if (index !== -1) {
                groups.value[index] = updatedGroup;
            }
            console.log(`Group updated: ${updatedGroup.name}`);
            saveToLocalStorage();
            errors.value = [];
            return updatedGroup;
        } catch (error) {
            console.error('Error updating group:', error);
            errors.value.push(error);
            throw error;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Deletes a group.
     */
    async function deleteGroup(id) {
        isLoading.value = true;
        try {
            await GroupsApi.delete(id);
            groups.value = groups.value.filter(g => g.id !== id);
            // Remove groupId from colleagues
            colleagues.value.forEach(colleague => {
                if (colleague.groupId === id) {
                    colleague.groupId = null;
                }
            });
            console.log(`Group deleted: ${id}`);
            saveToLocalStorage();
            errors.value = [];
            return true;
        } catch (error) {
            console.error('Error deleting group:', error);
            errors.value.push(error);
            return false;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        colleagues,
        groups,
        errors,
        colleaguesLoaded,
        isLoading,
        selectedColleague,
        colleaguesCount,
        colleaguesByGroup,
        colleaguesWithoutGroup,
        fetchColleagues,
        fetchColleagueById,
        addColleague,
        updateColleague,
        deleteColleague,
        clearErrors,
        selectColleague,
        clearSelection,
        fetchGroups,
        addGroup,
        updateGroup,
        deleteGroup,
        loadFromLocalStorage,
        saveToLocalStorage
    };
});

export default useColleaguesStore;
