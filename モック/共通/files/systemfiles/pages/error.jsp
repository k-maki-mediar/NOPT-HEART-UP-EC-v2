<%-- 12.1.1_11336_add_start --%>
<%@ include file="/WEB-INF/include/cache-control.jsp" %>
<%@ include file="/WEB-INF/include/dtd-def.jsp" %>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core"%>
<c:set var="path" value="pc" />
<%-- クライアント端末によって画面を分ける場合はコメントを外す --%>
<%--<c:if test="${!empty clientType}">
  <c:set var="path" value="${(!empty clientType.path) ? clientType.path : 'pc'}" />
</c:if>--%>
<jsp:forward page="/cms/${path}/error/error/error.html" />
<%-- 12.1.1_11336_add_end --%>